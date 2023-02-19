import { tokenise } from "./tokeniser.js";
import { buildJavascript } from "./builder.js";
const compile_file = async (file: string[], std: string) => {
	const fileContents = file[1];
	const tokens = tokenise(fileContents);
	const output = buildJavascript(tokens);
	const output_with_std = std + output;
	return output_with_std;
};
export const compile = async (files: string[][], std_str: string) => {
	const compiled_files: string[][] = [];
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const result = await compile_file(file, std_str);
		compiled_files.push([file[0] + ".js", result]);
	}
	return compiled_files;
};
