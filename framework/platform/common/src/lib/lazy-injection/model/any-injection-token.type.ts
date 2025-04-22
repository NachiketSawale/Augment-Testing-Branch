/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { LazyInjectionToken } from './lazy-injectable.model';

/**
 * Represents an injection token that is either meant for lazy injection or for Angular injection.
 */
export type AnyInjectionToken<T> = LazyInjectionToken<T> | InjectionToken<T>;

/**
 * Checks whether a given injection token is a lazy injection token.
 * @param token The token to check.
 * @returns A value that indicates whether the token is a lazy injection token.
 */
export function isLazyInjectionToken<T>(token: T | AnyInjectionToken<T>): token is LazyInjectionToken<T> {
	return token instanceof LazyInjectionToken;
}

/**
 * Checks whether a given injection token is an Angular injection token.
 * @param token The token to check.
 * @returns A value that indicates whether the token is an Angular injection token.
 */
export function isAngularInjectionToken<T>(token: T | AnyInjectionToken<T>): token is InjectionToken<T> {
	return token instanceof InjectionToken;
}
