/*
 * Copyright(c) RIB Software GmbH
 */

import { camelCase } from 'lodash';

/**
 * Converts a module name written in kebab case to pascal case.
 *
 * @param moduleName The module name.
 *
 * @returns The converted module name.
 */
export function kebabCaseModuleNameToPascalCase(moduleName: string) {
	const resultParts = moduleName.split('.');
	for (const idx in resultParts) {
		let rp = camelCase(resultParts[idx]);
		if (rp.length > 0) {
			rp = rp.charAt(0).toUpperCase() + rp.substring(1);
		}
		resultParts[idx] = rp;
	}
	return resultParts.join('.');
}
