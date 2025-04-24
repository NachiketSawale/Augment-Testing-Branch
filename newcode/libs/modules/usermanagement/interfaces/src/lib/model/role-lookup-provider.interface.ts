/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';
/**
 * Options for role lookups.
 */
export interface IRoleLookupOptions {
	/**
	 * A filter to apply to the role lookup.
	 */
	filter?: string;
}

/**
 * Provides role-related lookups.
 */
export interface IRoleLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a role.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateRoleLookup<T extends object>(): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates role lookup field overloads.
 */
export const ROLE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IRoleLookupProvider>('usermanagement.role.RoleLookupProvider');
