/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '../../model';

/**
 * Represents a type that can either be an immediate value, a factory function, or an asynchronous
 * factory function.
 */
export type AsyncCtxFactoryEnabled<T> = T | ((context: IInitializationContext) => T | Promise<T>);

/**
 * Checks whether a given async factory enabled value is a factory function.
 * @param valueSource The value to check.
 */
export function isAsyncCtxFactory<T>(valueSource: AsyncCtxFactoryEnabled<T>): valueSource is (context: IInitializationContext) => T | Promise<T> {
	return typeof valueSource === 'function';
}