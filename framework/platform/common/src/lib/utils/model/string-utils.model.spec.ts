/*
 * Copyright(c) RIB Software GmbH
 */

import { kebabCaseModuleNameToPascalCase } from './string-utils.model';

describe ('kebabCaseModuleNameToPascalCase', () => {
	it('should convert a simple module name', () => {
		const module = kebabCaseModuleNameToPascalCase('abc.xyz');
		expect(module).toBe('Abc.Xyz');
	});

	it('should convert a module name without a sub-module', () => {
		const module = kebabCaseModuleNameToPascalCase('abcxyz');
		expect(module).toBe('Abcxyz');
	});

	it('should convert a multi-word module name', () => {
		const module = kebabCaseModuleNameToPascalCase('abc-def.x-yz-ghij');
		expect(module).toBe('AbcDef.XYzGhij');
	});
});
