/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Filter Script Token, use for collect the token detail of script after Lexical analysis
 */
export interface IFilterScriptToken {
	start: number;
	end: number;
	string: string;
	type: string;
	line: number;
	isChecked: boolean;
}