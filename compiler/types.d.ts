export type Token = {
	type:
		| ""
		| "fun_def"
		| "fun_call"
		| "while_loop_start"
		| "for_loop_start"
		| "if_start"
		| "else_if"
		| "else"
		| "end_block"
		| "variable_assignment"
		| "variable_assignment_indexed"
		| "comparison"
		| "value";
	name?: string;
	params?: Token[];
	condition?: Token;
	variable_name?: string;
	variable_value?: Token;
	operator?: string;
	operand1?: Token;
	operand2?: Token;
	value?: string;
	initVal?: Token;
	endVal?: Token;
	index_val?: Token;
};
