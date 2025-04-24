/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for user lookups.
 */
export interface IUserLookupOptions {
	/**
	 * A filter to apply to the user lookup.
	 */
	filter?: string;
}

/**
 * Provides user-related lookups.
 */
export interface IUserLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a user.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateUserLookup<T extends object>(): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates user lookup field overloads.
 */
export const USER_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IUserLookupProvider>('usermanagement.user.UserLookupProvider');
