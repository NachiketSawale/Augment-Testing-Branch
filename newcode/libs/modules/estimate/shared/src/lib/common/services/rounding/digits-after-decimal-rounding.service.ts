/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

type MathFunc = (value : number) => number;

/**
 * Rounding logic for Digits after decimal point
 */
@Injectable({ providedIn: 'root' })
export class DigitsAfterDecimalRounding {

	public constructor() {
		if (Math.trunc === undefined) {
			Math.trunc = function(v) {
				return v < 0 ? Math.ceil(v) : Math.floor(v);
			};
		}
	}

	/**
	 * Standard Decimal round (half away from zero)
	 * @param num
	 * @param decimalPlaces
	 */
	public round(num: number, decimalPlaces: number) {
		return this.decimalAdjust('round', num, decimalPlaces);
	}

	/**
	 * Decimal ceil
	 * @param num
	 * @param decimalPlaces
	 */
	public ceil(num: number, decimalPlaces: number) {
		return this.decimalAdjust('ceil', num, decimalPlaces);
	}

	/**
	 * Decimal floor
	 * @param num
	 * @param decimalPlaces
	 */
	public floor(num: number, decimalPlaces: number) {
		return this.decimalAdjust('floor', num, decimalPlaces);
	}

	private decimalAdjust(type: keyof Math, num: number, decimalPlaces: number): number {
		if (type === 'round' && num < 0) {
			return -this.decimalAdjust(type, -num, decimalPlaces);
		}

		const n = this.shift(num, +decimalPlaces);

		if(typeof Math[type] === 'function'){
			const value = (Math[type] as MathFunc).apply(Math, [n]);
			return this.shift(value, -decimalPlaces);
		}else{
			throw new Error(`Math.${type as string} is not a function`);
		}
	}

	private shift(num: number, exponent: number): number {
		const value = (num + 'e').split('e');
		return +(value[0] + 'e' + (+value[1] + (exponent || 0)));
	}
}