/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpParams } from '@angular/common/http';
import { isNumber, isString, isBoolean, get } from 'lodash';

/**
 * Convert a plain JSON object into http parameters
 * @param jsonObject
 */
export function convertJsonObjectToHttpParams(jsonObject: object): HttpParams {
	let params = new HttpParams();

	Object.keys(jsonObject).forEach((key) => {
		const value = get(jsonObject, key);

		if (isString(value) || isNumber(value) || isBoolean(value)) {
			params = params.set(key, value as string | number | boolean);
		}
	});

	return params;
}

/**
 * Maps an array to another array, skipping null values
 * @param array
 * @param mapFunction
 */
export function skipNullMap<T, M>(array: T[] | null | undefined, mapFunction: (value: T) => M | null | undefined): M[] {
	const result: M[] = [];

	if (array) {
		array.forEach((e) => {
			const value = mapFunction(e);
			if (value != null) {
				result.push(value);
			}
		});
	}

	return result;
}

/**
 * Checks if the given result is a promise
 * @param result
 */
export function isPromise<T>(result: T | Promise<T>): result is Promise<T> {
	return result instanceof Promise;
}