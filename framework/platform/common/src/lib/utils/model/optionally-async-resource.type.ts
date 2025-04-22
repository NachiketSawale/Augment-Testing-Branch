/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import {
	AnyInjectionToken,
	AsyncCtxFactoryEnabled,
	IInitializationContext,
	LazyInjectionToken
} from '../../../index';

/**
 * Represents a resource that may or may not be available asynchronously,
 * possibly by a factory method or by means of injection.
 */
export type OptionallyAsyncResource<T> = AsyncCtxFactoryEnabled<T> | AnyInjectionToken<T>;

/**
 * Checks whether an optionally asynchronous resource is a factory function.
 * @param value The value to check.
 */
export function isResourceFactory<T>(value?: OptionallyAsyncResource<T>): value is (((context: IInitializationContext) => T | Promise<T>)) {
	return Boolean(value) && (typeof value === 'function');
}

/**
 * Checks whether an optionally asynchronous resource is a lazy injection token.
 * @param value The value to check.
 */
export function isLazyResourceToken<T>(value?: OptionallyAsyncResource<T>): value is LazyInjectionToken<T> {
	return Boolean(value) && (value instanceof LazyInjectionToken);
}

/**
 * Checks whether an optionally asynchronous resource is a factory function or a lazy injection token.
 * @param value The value to check.
 */
export function isAsyncResource<T>(value?: OptionallyAsyncResource<T>): value is ((((context: IInitializationContext) => T | Promise<T>)) | LazyInjectionToken<T>) {
	return isResourceFactory(value) || isLazyResourceToken(value);
}

/**
 * Checks whether an optionally asynchronous resource is an Angular injection token.
 * @param value The value to check.
 */
export function isAngularResourceToken<T>(value?: OptionallyAsyncResource<T>): value is InjectionToken<T> {
	return Boolean(value) && (value instanceof InjectionToken);
}
