/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from './property-path.type';

/**
 * An interface for objects that can read a value, typically from a field within an object instance.
 */
export interface IReadOnlyPropertyAccessor<T extends object, P extends PropertyType = PropertyType> {

	/**
	 * Retrieves the value from a given instance.
	 * @param obj The object instance to read from.
	 * @return The retrieved value.
	 */
	getValue(obj: T): P | undefined;
}

/**
 * Checks whether a given value is of type {@link IReadOnlyPropertyAccessor}.
 * @param x The value to check.
 */
export function isReadOnlyPropertyAccessor<T extends object, P extends PropertyType = PropertyType>(x: unknown): x is IReadOnlyPropertyAccessor<T, P> {
	return typeof x === 'object' && typeof (x as {[key: string]: unknown})['getValue'] === 'function';
}