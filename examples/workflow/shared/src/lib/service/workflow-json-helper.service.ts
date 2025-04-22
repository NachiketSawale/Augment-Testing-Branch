/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class WorkflowJsonHelperService {

	/**
	 * Recursively parses string into a JSON object.
	 * @param str
	 * @returns
	 */
	public parseDeep<T>(str: string): T | string {
		try {
			return JSON.parse(str, (key, value) => {
				if (typeof (value) === 'string') {
					return this.parseDeep(value);
				}
				return value;
			});
		} catch (exception) {
			return str;
		}
	}
}
