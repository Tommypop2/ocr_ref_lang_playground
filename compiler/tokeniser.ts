import { Token } from "./types";
function isAssignment(statement: string) {
  const assignmentOperators = ["=", "+=", "-=", "*=", "/="];
  let result = "";
  assignmentOperators.forEach((e) => {
    if (statement.includes(e)) {
      result = e;
    }
  });
  return result;
}
function isComparison(statement: string) {
  const comparisonOperators = ["==", "!=", ">=", "<=", ">", "<"];
  let result = "";
  comparisonOperators.forEach((e) => {
    if (statement.includes(e)) {
      result = e;
    }
  });
  return result;
}
function isFunctionCall(statement: string) {
  if (statement.endsWith(")") && statement.includes("(")) {
    return true;
  }
}
function tokenise_statement(statement: string) {
  statement = statement.trim();
  let token: Token = { type: "" };
  if (statement.startsWith("function ")) {
    statement = statement.replace("function ", "");
    token["type"] = "fun_def";
    const split = statement.split("(");
    token["name"] = split[0];
    token["params"] = split[1]
      .replace(")", "")
      .split(",")
      .map((e) => tokenise_statement(e.trim()));
  } else if (statement.startsWith("while ")) {
    statement = statement.replace("while", "").trim();
    token["type"] = "while_loop_start";
    token["condition"] = tokenise_statement(statement.replace("(", "").replace(")", ""));
  } else if (statement.startsWith("for ")) {
    statement = statement.replace("for ", "");
    token["type"] = "for_loop_start";
    const conditionStr = statement.split("to")[0].trim();
    token["initVal"] = tokenise_statement(conditionStr);
    const endValStr = statement.split("to")[1].trim();
    token["endVal"] = tokenise_statement(endValStr);
  } else if (statement.startsWith("if ")) {
    statement = statement.replace("if ", "");
    const conditionStr = statement.replace("(", "").replace(")", "").trim();
    const condition = tokenise_statement(conditionStr);
    token["type"] = "if_start";
    token["condition"] = condition;
  } else if (statement.startsWith("else if ")) {
    statement = statement.replace("else if ", "");
    const conditionStr = statement.replace("(", "").replace(")", "").trim();
    const condition = tokenise_statement(conditionStr);
    token["type"] = "else_if";
    token["condition"] = condition;
  } else if (statement.startsWith("else")) {
    token["type"] = "else";
  } else if (statement.startsWith("end")) {
    token["type"] = "end_block";
  } else if (statement.startsWith("next")) {
    token["type"] = "end_block";
  } else if (isComparison(statement) != "") {
    token["type"] = "comparison";
    const operator = isComparison(statement);
    const [operand1, operand2] = statement.split(operator).map((e) => tokenise_statement(e.trim()));
    token["operand1"] = operand1;
    token["operand2"] = operand2;
    token["operator"] = operator;
  } else if (isAssignment(statement) != "") {
    const operator = isAssignment(statement);
    const split = statement.split(operator);
    const varName = split[0].trim();
    if (varName.endsWith("]") && varName.includes("[")) {
      token["type"] = "variable_assignment_indexed";
      token["variable_name"] = varName.split("[")[0].trim();
      token["index_val"] = tokenise_statement(varName.split("[")[1].replace("]", "").trim());
      token["variable_value"] = tokenise_statement(split[1].trim());
      token["operator"] = operator;
    } else {
      token["type"] = "variable_assignment";
      token["variable_name"] = split[0].trim();
      token["variable_value"] = tokenise_statement(split[1].trim());
      token["operator"] = operator;
    }
  } else if (isFunctionCall(statement)) {
    const funName = statement.split("(")[0];
    token["type"] = "fun_call";
    token["name"] = funName;
    let argsStr = statement.replace(funName + "(", ""); //Not ideal solution
    argsStr = argsStr.substring(0, argsStr.length - 1);
    let depth = 0;
    let lastSplitInd = -1;
    let splits = [];
    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if (char == "(") depth++;
      if (char == ")") depth--;
      if (char == "," && depth == 0) {
        splits.push(argsStr.substring(lastSplitInd + 1, i));
        lastSplitInd = i;
      }
    }
    splits.push(argsStr.substring(lastSplitInd + 1, argsStr.length));
    token["params"] = splits.map((e) => tokenise_statement(e.trim()));
    console.log(token["params"]);
  } else {
    token["type"] = "value";
    token["value"] = statement;
  }
  return token;
}
export function tokenise(fileContent: string) {
  let tokens = [];
  let lines = fileContent.split("\n");
  lines = lines.filter((e) => e != "");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    tokens.push(tokenise_statement(line));
  }
  return tokens;
}
