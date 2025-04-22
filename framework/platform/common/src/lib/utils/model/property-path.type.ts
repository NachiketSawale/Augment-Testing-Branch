/*
 * Copyright(c) RIB Software GmbH
 */

import { get as getProperty, set as setProperty } from 'lodash';

import { IPropertyAccessor } from './property-accessor.interface';
import { IReadOnlyPropertyAccessor } from './read-only-property-accessor.interface';
import { IIdentificationData } from '../../model/identification-data.interface';
import { RgbColor } from './rgb-color.class';
import { IDescriptionInfo } from '../../model/interfaces/description-info.interface';
import { IFileSelectControlResult } from './file-select-control-result.interface';

/**
 * Covers the non-array form of all basic data types typically found in form fields.
 */
type ScalarPropertyType = string | number | boolean | Date | IFileSelectControlResult | IIdentificationData | RgbColor | IDescriptionInfo | object;

/**
 * Covers the basic data types typically found in form fields.
 */
export type PropertyType = ScalarPropertyType | ScalarPropertyType[];

type Primitive = string | number | boolean | Date | null | undefined | (() => void);

type ExcludedVals = Extract<keyof string, string> | Extract<keyof boolean, string> | Extract<keyof Date, string> | Extract<keyof number, string> | Extract<keyof [], string>;

type isExactMatch<T> = Extract<keyof T, string> extends Extract<IFileSelectControlResult, string> ? true :
	Extract<keyof T, string> extends Extract<IIdentificationData, string> ? true :
	Extract<keyof T, string> extends Extract<RgbColor, string> ? true :
	Extract<keyof T, string> extends Extract<IDescriptionInfo, string> ? true : false;

type isMatch<T> = T extends Primitive ? true :
	T extends object ? isExactMatch<T> : false;

// Property path solution as per: https://stackoverflow.com/questions/78551449/how-to-get-out-of-ts2615-circular-reference-situation-with-dotted-property-paths

// Exceptional disabling of ESLint rule to enable highly generic type (kh):
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PathsToStringProps<T, U = never, V = T> =
	[V] extends [U] ? [] :
	isMatch<T> extends true ? [] : {
		[K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K], U | V>]
	}[Exclude<Extract<keyof T, string>, 'prototype' | ExcludedVals>];

// Exceptional disabling of ESLint rule to enable highly generic type (kh):
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Join<T extends any[], D extends string> =
	T extends [] ? never :
	T extends [infer F] ? F :
	T extends [infer F, ...infer R] ?
	F extends string ? string extends F ? string : `${F}${D}${Join<R, D>}` : never : string;

/**
 * Represents a dot-separated property path on a given object type.
 */
export type PropertyPath<T extends object, P extends PropertyType = PropertyType> = string | (Join<PathsToStringProps<T, P>, '.'> & string);

export type TypedPropertyPath<T> = Join<PathsToStringProps<T>, '.'>;

export type AllKeys<T, U = never, V = T> = [V] extends [U] ? never :
	T extends Array<infer P> ? `[${number}]` | `[${number}].${AllKeys<P, U | V>}` :
	T extends object ?
	{
		[K in keyof T]: K extends string ? (T[K] extends Primitive ? `${K}` :
			`${K}` | `${K}.${AllKeys<T[K], U | V>}`) : ''
	}[keyof T] : never;
/**
 * A read-only data accessor that can read values based on a property path.
 */
export class ReadOnlyPropertyPathAccessor<T extends object, P extends PropertyType = PropertyType> implements IReadOnlyPropertyAccessor<T, P> {

	/**
	 * Initializes a new instance.
	 * @param propertyPath The property path to use.
	 */
	public constructor(protected readonly propertyPath: PropertyPath<T>) {
	}

	/**
	 * Retrieves the value from a given instance.
	 * @param obj The object instance to read from.
	 * @return The retrieved value.
	 */
	public getValue(obj: T): P | undefined {
		return getProperty<T, string>(obj, this.propertyPath);
	}
}

/**
 * A data acessor that can read and write values based on a property path.
 */
export class PropertyPathAccessor<T extends object, P extends PropertyType = PropertyType> extends ReadOnlyPropertyPathAccessor<T, P> implements IPropertyAccessor<T, P> {

	/**
	 * Initializes a new instance.
	 * @param propertyPath The property path to use.
	 */
	public constructor(propertyPath: PropertyPath<T>) {
		super(propertyPath);
	}

	/**
	 * Writes a value to a given object instance.
	 * @param obj The object instance to write to.
	 * @param value The value to write.
	 */
	public setValue(obj: T, value: P | undefined): void {
		setProperty<T>(obj, this.propertyPath, value);
	}
}

/**
 * A value that identifies a property on an object type.
 */
export type PropertyIdentifier<T extends object, P extends PropertyType = PropertyType> = PropertyPath<T> | IReadOnlyPropertyAccessor<T, P> | IPropertyAccessor<T, P>;