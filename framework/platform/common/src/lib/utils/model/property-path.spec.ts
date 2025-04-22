/*
 * Copyright(c) RIB Software GmbH
 */

import { AllKeys } from './property-path.type';

describe('PropertyPathAllKeys', () => {
	it('it should include all the base level keys', () => {
		type TestType = {
			prop1: number;
			prop2: string;
			prop3: Date;
			prop4: boolean;
			prop5: null;
			prop6: undefined;
		};
		type TestTypeKeys = AllKeys<TestType>;
		type AssertKeys = ('prop1' extends TestTypeKeys ? true : false) &
			('prop2' extends TestTypeKeys ? true : false) &
			('prop3' extends TestTypeKeys ? true : false) &
			('prop4' extends TestTypeKeys ? true : false) &
			('prop5' extends TestTypeKeys ? true : false) &
			('prop6' extends TestTypeKeys ? true : false);
		const pass: AssertKeys = true;
		expect(pass).toBe(true);
	});

	it('it should include all the nested keys', () => {
		type NestedType = {
			prop1: number;
			prop2: string;
			prop3: Date;
			prop4: boolean;
			prop5: null;
			prop6: undefined;
		};
		type BaseType = {
			prop1: number;
			prop2: string;
			prop3: Date;
			prop4: boolean;
			prop5: null;
			prop6: undefined;
			prop7: NestedType
		};
		type BaseTypeKeys = AllKeys<BaseType>;
		type AssertKeys = ('prop1' extends BaseTypeKeys ? true : false) &
			('prop2' extends BaseTypeKeys ? true : false) &
			('prop3' extends BaseTypeKeys ? true : false) &
			('prop4' extends BaseTypeKeys ? true : false) &
			('prop5' extends BaseTypeKeys ? true : false) &
			('prop6' extends BaseTypeKeys ? true : false) &
			('prop7' extends BaseTypeKeys ? true : false) &
			('prop7.prop1' extends BaseTypeKeys ? true : false) &
			('prop7.prop2' extends BaseTypeKeys ? true : false) &
			('prop7.prop3' extends BaseTypeKeys ? true : false) &
			('prop7.prop4' extends BaseTypeKeys ? true : false) &
			('prop7.prop5' extends BaseTypeKeys ? true : false) &
			('prop7.prop6' extends BaseTypeKeys ? true : false);
		const pass: AssertKeys = true;
		expect(pass).toBe(true);
	});

	it('it should include all the base level keys', () => {
		type BaseType = {
			prop1: number;
			prop2: string;
			prop3: Date;
			prop4: boolean;
			prop5: null;
			prop6: undefined;
			prop7: BaseType
		};
		type BaseTypeKeys = AllKeys<BaseType>;
		type AssertKeys = ('prop1' extends BaseTypeKeys ? true : false) &
			('prop2' extends BaseTypeKeys ? true : false) &
			('prop3' extends BaseTypeKeys ? true : false) &
			('prop4' extends BaseTypeKeys ? true : false) &
			('prop5' extends BaseTypeKeys ? true : false) &
			('prop6' extends BaseTypeKeys ? true : false) &
			('prop7' extends BaseTypeKeys ? true : false) &
			('prop7.prop1' extends BaseTypeKeys ? false : true) &
			('prop7.prop2' extends BaseTypeKeys ? false : true) &
			('prop7.prop3' extends BaseTypeKeys ? false : true) &
			('prop7.prop4' extends BaseTypeKeys ? false : true) &
			('prop7.prop5' extends BaseTypeKeys ? false : true) &
			('prop7.prop6' extends BaseTypeKeys ? false : true);
		const pass: AssertKeys = true;
		expect(pass).toBe(true);
	});
});

