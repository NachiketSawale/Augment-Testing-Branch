/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface INumberShortening {
	prefixData: string;
	numberData: number;

	/**
	 * this function returns the object but when we apply the object as a return type showing errors
	 */
	getCharacteristicAndMantissa(value: number, numeralSystem: number): Array<string>;

	getMostSignificantFigurePostition(value: number, numeralSystem: number): number;

	/**
	 * used any as function return type, its showing error if used IGetPrefixesResult, 'Type 'number' is not assignable to type 'IGetPrefixesResult'
	 */
	getPrefixes(prefixSystem: string, prefixNumberSystem: number, location?: string): any;

	getString(rounddigit: number, prefix?: string, number?: number): string;

	getShortNumber(value: number, prefixSystem: string, prefixNumberSystem: number, location?: string): object;
}
/**
 * interface for Output of getPrefixes function
 */
export interface IGetPrefixesResult {
	prefix: string;
	numeralSystem: number;
	amountInPower: number;
}

/**
 * Output array of object for getShortNumber function
 */
export interface IGetShortNumberResult {
	prefix: string;
	number: number;
	getString: Function;
}
