/*
 * Copyright(c) RIB Software GmbH
 */

import { AnyInjectionToken, AsyncFactoryEnabled, LazyInjectionToken } from '@libs/platform/common';
import { AsyncContainerFactoryEnabled } from './async-container-factory-enabled.type';
import { IContainerInitializationContext } from './container-initialization-context.interface';
import { InjectionToken } from '@angular/core';

/**
 * Represents a container-related resource that may or may not be available asynchronously,
 * possibly by a factory method or by means of injection.
 */
export type OptionallyAsyncContainerResource<T> = AsyncFactoryEnabled<T> | AsyncContainerFactoryEnabled<T> | AnyInjectionToken<T>;

/**
 * Checks whether an optionally asynchronous container resource is a factory function.
 * @param value The value to check.
 */
export function isContainerResourceFactory<T>(value?: OptionallyAsyncContainerResource<T>): value is ((() => T | Promise<T>) | ((context: IContainerInitializationContext) => T | Promise<T>)) {
	return Boolean(value) && (typeof value === 'function');
}

/**
 * Checks whether an optionally asynchronous container resource is a lazy injection token.
 * @param value The value to check.
 */
export function isLazyContainerResourceToken<T>(value?: OptionallyAsyncContainerResource<T>): value is LazyInjectionToken<T> {
	return Boolean(value) && (value instanceof LazyInjectionToken);
}

/**
 * Checks whether an optionally asynchronous container resource is a factory function or a lazy injection token.
 * @param value The value to check.
 */
export function isAsyncContainerResource<T>(value?: OptionallyAsyncContainerResource<T>): value is (((() => T | Promise<T>) | ((context: IContainerInitializationContext) => T | Promise<T>)) | LazyInjectionToken<T>) {
	return isContainerResourceFactory(value) || isLazyContainerResourceToken(value);
}

/**
 * Checks whether an optionally asynchronous container resource is an Angular injection token.
 * @param value The value to check.
 */
export function isAngularContainerResourceToken<T>(value?: OptionallyAsyncContainerResource<T>): value is InjectionToken<T> {
	return Boolean(value) && (value instanceof InjectionToken);
}
