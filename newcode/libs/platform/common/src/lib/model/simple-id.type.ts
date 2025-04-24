/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents a simple scalar ID value.
 */
export type SimpleId = string | number;

/**
 * Represents a property name of a given type `T` whose type is {@link SimpleId} or `undefined`.
 *
 * @typeParam T A type T whose properties are considered.
 */
export type SimpleIdProperty<T> = {
	[K in keyof T]: T[K] extends (SimpleId | undefined) ? K : never
}[keyof T];
