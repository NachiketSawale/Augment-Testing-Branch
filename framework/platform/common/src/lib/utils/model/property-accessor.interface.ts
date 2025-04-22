/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from './property-path.type';
import { IReadOnlyPropertyAccessor, isReadOnlyPropertyAccessor } from './read-only-property-accessor.interface';

/**
 * An interface for objects that can store a value, typically in a field within an object instance.
 */
export interface IPropertyAccessor<T extends object, P extends PropertyType = PropertyType> extends IReadOnlyPropertyAccessor<T, P> {

	/**
	 * Writes a value to a given object instance.
	 * @param obj The object instance to write to.
	 * @param value The value to write.
	 */
	setValue(obj: T, value: P | undefined): void;
}

/**
 * Checks whether a given value is of type {@link IPropertyAccessor}.
 * @param x The value to check.
 */
export function isPropertyAccessor<T extends object, P extends PropertyType = PropertyType>(x: unknown): x is IPropertyAccessor<T, P> {
	return typeof (x as {[key: string]: unknown})['setValue'] === 'function' &&
		isReadOnlyPropertyAccessor<T, P>(x);
}