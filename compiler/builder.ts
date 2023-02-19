import { Token } from "./types";
let astDepth = 0;
let scoped_variables: any = {};
const addNewScopedVar = (name: string, depth?: number) => {
	if (depth == undefined) {
		depth = astDepth;
	}
	if (scoped_variables[depth] == undefined) {
		scoped_variables[depth] = [];
	}
	scoped_variables[depth].push(name);
};
const isVarInScope = (name: string) => {
	let isInScope = false;
	let inScopeVars: string[] = [];
	for (let i = astDepth; i > -1; i--) {
		inScopeVars = inScopeVars.concat(scoped_variables[i]);
	}
	inScopeVars.forEach((e) => {
		if (e == name) {
			isInScope = true;
		}
	});
	return isInScope;
};
const removeUnscopedVars = (depth: number) => {
	const keys = Object.keys(scoped_variables);
	const max = Math.max(...keys.map((x) => parseInt(x)));
	for (let i = depth + 1; i <= max; i++) {
		scoped_variables[i] = [];
	}
};
function evaluateToken(token: Token): string {
	if (token.type == "fun_def") {
		let argsString = "";
		const params = token.params!;
		params.forEach((e, index) => {
			const varName = evaluateToken(e);
			addNewScopedVar(varName, astDepth + 1);
			argsString += varName;

			if (index < params.length! - 1) {
				argsString += ", ";
			}
		});
		astDepth += 1;
		return `function ${token.name}(${argsString}){`;
	}
	if (token.type == "for_loop_start") {
		const initVal = evaluateToken(token.initVal!);
		const endVal = evaluateToken(token.endVal!);
		const variableName = initVal.split("=")[0].replace("let", "").trim(); //Redoing some work here, but that's
		// the entire transpiler in a nutshell I guess
		astDepth += 1;
		return `for (${initVal}; ${variableName}<=${endVal}; ${variableName}++){`;
	}
	if (token.type == "while_loop_start") {
		const condition = evaluateToken(token.condition!);
		return `while (${condition}){`;
	}
	if (token.type == "if_start") {
		const condition = evaluateToken(token.condition!);
		return `if (${condition}){`;
	}
	if (token.type == "else_if") {
		const condition = evaluateToken(token.condition!);
		return `}else if (${condition}){`;
	}
	if (token.type == "else") {
		return `}else {`;
	}
	if (token.type == "variable_assignment_indexed") {
		const varName = token.variable_name!;
		const indexStr = evaluateToken(token.index_val!);
		const newVal = evaluateToken(token.variable_value!);
		const isInScope = isVarInScope(varName);
		if (!isInScope) {
			// Error: Array accessed at index hasn't been created
		}
		return `${varName}[${indexStr}] = ${newVal}`;
	}
	if (token.type == "variable_assignment") {
		const varName = token.variable_name!;
		if (scoped_variables[astDepth] == undefined) {
			scoped_variables[astDepth] = [];
		}
		const isInScope = isVarInScope(varName);
		if (!isInScope) {
			scoped_variables[astDepth].push(varName);
		}
		const value = evaluateToken(token.variable_value!);
		return `${isInScope ? "" : "let "}${varName} ${token.operator} ${value}`;
	}
	if (token.type == "comparison") {
		const operand1 = evaluateToken(token.operand1!);
		const operand2 = evaluateToken(token.operand2!);
		const operator = token.operator!;
		return `${operand1} ${operator} ${operand2}`;
	}
	if (token.type == "end_block") {
		astDepth -= 1;
		removeUnscopedVars(astDepth);
		return "}";
	}
	if (token.type == "fun_call") {
		const name = token["name"]!;
		const args = token["params"]!;
		const parsedArgs = args.map((arg) => evaluateToken(arg));
		let argsStr = "";
		for (let i = 0; i < parsedArgs.length; i++) {
			let argStr = parsedArgs[i];
			if (i != 0) {
				argStr = "," + argStr;
			}
			argsStr += argStr;
		}
		return `${name}(${argsStr})`;
	}
	if (token.type == "value") {
		return token.value!;
	}
	return "";
}
export function buildJavascript(tokens: Token[]) {
	let jsCode = "";
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		let newJsCode;
		newJsCode = evaluateToken(token);
		newJsCode += "\n";
		// newJsCode += ";";
		jsCode += newJsCode;
	}
	scoped_variables = {};
	astDepth = 0;
	return jsCode;
}
