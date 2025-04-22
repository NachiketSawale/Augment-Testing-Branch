/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents a type that can either be an immediate value, a factory function, or an asynchronous
 * factory function.
 */
export type AsyncFactoryEnabled<T> = T | (() => T | Promise<T>);

/**
 * Checks whether a given async factory enabled value is a factory function.
 * @param valueSource The value to check.
 */
export function isAsyncFactory<T>(valueSource: AsyncFactoryEnabled<T>): valueSource is () => T | Promise<T> {
	return typeof valueSource === 'function';
}