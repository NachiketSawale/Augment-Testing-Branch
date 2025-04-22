/*
 * Copyright(c) RIB Software GmbH
 */

import { IContainerInitializationContext } from './container-initialization-context.interface';

/**
 * Represents a type that can either be supplied as an immediate value, or as a factory function
 * that, given a container initialization context, returns a value synchronously or asynchronously.
 */
export type AsyncContainerFactoryEnabled<T> = T | ((context: IContainerInitializationContext) => T | Promise<T>);

/**
 * Checks whether a given async factory enabled value is a factory function.
 * @param valueSource The value to check.
 */
export function isAsyncContainerFactory<T>(valueSource: AsyncContainerFactoryEnabled<T>): valueSource is (context: IContainerInitializationContext) => T | Promise<T> {
	return typeof valueSource === 'function';
}