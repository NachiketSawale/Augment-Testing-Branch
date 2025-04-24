/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldOverload } from './field-overload.interface';
import { IStringFieldOverload } from './string-field-overload.interface';
import { INumericFieldOverload } from './numeric-field-overload.interface';
import { ICustomComponentFieldOverload } from './custom-component-field-overload.interface';
import { FieldType, isNumericFieldType, isStringFieldType } from '../field-type.enum';
import { IColorFieldOverload } from './color-field-overload.interface';
import { ICompositeFieldOverload } from './composite-field-overload.interface';
import { ILookupFieldOverload } from './lookup-field-overload.interface';
import { ISelectFieldOverload } from './select-field-overload.interface';
import { IBooleanFieldOverload } from './boolean-field-overload.interface';
import { IPasswordFieldOverload } from './password-field-overload.interface';
import { IGridFieldOverload } from './grid-field-overload.interface';
import {IDynamicFieldOverload} from './dynamic-field-overload.interface';
import { ILookupInputSelectFieldOverload } from './lookup-input-select-field-overload.interface';
import { IDateFieldOverload } from './date-field-overload.interface';
import { IDateUtcFieldOverload } from './date-utc-field-overload.interface';
import { IDateTimeFieldOverload } from './date-time-field-overload.interface';
import { IDateTimeUtcFieldOverload } from './date-time-utc-field-overload.interface';
import { IActionFieldOverload } from './action-field-overload.interface';

/**
 * The union of all valid field overloads.
 *
 * @group Layout Configuration
 */
export type ConcreteFieldOverload<T extends object> =
	IBooleanFieldOverload<T> |
	IStringFieldOverload<T> |
	INumericFieldOverload<T> |
	ICustomComponentFieldOverload<T> |
	IColorFieldOverload<T> |
	ICompositeFieldOverload<T> |
	ILookupFieldOverload<T> |
	ILookupInputSelectFieldOverload<T> |
	ISelectFieldOverload<T> |
	IPasswordFieldOverload<T> |
	IGridFieldOverload<T> |
	IDynamicFieldOverload<T> |
	IDateFieldOverload<T> |
	IDateUtcFieldOverload<T> |
	IDateTimeFieldOverload<T> |
	IDateTimeUtcFieldOverload<T> |
	IActionFieldOverload<T> |
	(IFieldOverload<T> & {
		type?: never;
	});

/**
 * A utility type that represents a concrete field overload with its type field guaranteed
 * to be assigned.
 *
 * @group Layout Configuration
 */
export type TypedConcreteFieldOverload<T extends object> = ConcreteFieldOverload<T> & {
	type: FieldType
};

// type guards

/**
 * Checks whether a field overload is untyped.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isUntypedFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IFieldOverload<T> {
	return !overload.type;
}

/**
 * Checks whether a field overload is a boolean field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isBooleanFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IBooleanFieldOverload<T> {
	if (overload.type) {
		return overload.type === FieldType.Boolean;
	}

	return false;
}

/**
 * Checks whether a field overload is a string field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isStringFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IStringFieldOverload<T> {
	if (overload.type) {
		return isStringFieldType(overload.type);
	}

	return false;
}

/**
 * Checks whether a field overload is a numeric field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isNumericFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is INumericFieldOverload<T> {
	if (overload.type) {
		return isNumericFieldType(overload.type);
	}

	return false;
}

/**
 * Checks whether a field overload is a custom component field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isCustomComponentFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is ICustomComponentFieldOverload<T> {
	return overload.type === FieldType.CustomComponent;
}

/**
 * Checks whether a field overload is a color field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isColorFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IColorFieldOverload<T> {
	return overload.type === FieldType.Color;
}

/**
 * Checks whether a field overload is a select field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isSelectFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is ISelectFieldOverload<T> {
	return overload.type === FieldType.Select || overload.type === FieldType.ImageSelect;
}

/**
 * Checks whether a field overload is a lookup field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isLookupFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is ILookupFieldOverload<T> {
	return overload.type === FieldType.Lookup;
}

/**
 * Checks whether a field overload is a lookup input select field overload.
 *
 * @param overload The field overload.
 *
 * @group Layout Configuration
 */
export function isLookupInputSelectFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is ILookupInputSelectFieldOverload<T> {
	return overload.type === FieldType.LookupInputSelect;
}

/**
 * Checks whether a field overload is a dynamic field overload.
 *
 * @param overload The field overload.
 */
export function isDynamicFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IDynamicFieldOverload<T> {
	return overload.type === FieldType.Dynamic;
}

/**
 * Checks whether a field overload is an action field overload.
 *
 * @param overload The field overload.
 */
export function isActionFieldOverload<T extends object>(overload: ConcreteFieldOverload<T>): overload is IActionFieldOverload<T> {
	return overload.type === FieldType.Action;
}
