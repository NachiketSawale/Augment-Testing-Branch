/*
 * Copyright(c) RIB Software GmbH
 */

import { isArray } from 'lodash';

/**
 * Used to filter selected items from a grid in generic wizard.
 */
export type Included = {
	/**
	 * Used to filter selected items.
	 */
	isIncluded: boolean
}

export function isIncluded<T extends object>(type: (T | Included)[]): type is (T&Included)[] {
	return isArray(type) && type.length !== 0 ? 'isIncluded' in type[0] : false;
}