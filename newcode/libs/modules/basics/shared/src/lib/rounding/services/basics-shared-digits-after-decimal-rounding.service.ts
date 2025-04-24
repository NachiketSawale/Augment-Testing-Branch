/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

/**
 * Rounding logic for Digits after decimal point
 */
@Injectable({providedIn: 'root'})
export class BasicsSharedDigitsAfterDecimalRounding {

	public constructor() {
		this.polyfillMathTruncIfNeeded();
	}

	public round(num: number, decimalPlaces: number): number {
		if (num < 0) {
			return -this.adjustDecimal(-num, decimalPlaces, (v) => Math.round(v));
		}
		return this.adjustDecimal(num, decimalPlaces, (v) => Math.round(v));
	}

	public ceil(num: number, decimalPlaces: number): number {
		return this.adjustDecimal(num, decimalPlaces, (v) => Math.ceil(v));
	}

	public floor(num: number, decimalPlaces: number): number {
		return this.adjustDecimal(num, decimalPlaces, (v) => Math.floor(v));
	}

	private polyfillMathTruncIfNeeded() {
		if (!Math.trunc) {
			Math.trunc = function (v: number) {
				return v < 0 ? Math.ceil(v) : Math.floor(v);
			};
		}
	}

	private adjustDecimal(num: number, decimalPlaces: number, mathFunc: (v: number) => number) {
		if (decimalPlaces < 0) {
			throw new Error('decimalPlaces must be a non-negative number');
		}

		const multiplier = Math.pow(10, decimalPlaces);
		const adjustedNum = mathFunc(num * multiplier);
		return adjustedNum / multiplier;
	}
}