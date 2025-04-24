/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for group lookups.
 */
export interface IGroupLookupOptions {
	/**
	 * A filter to apply to the group lookup.
	 */
	filter?: string;
}

/**
 * Provides group-related lookups.
 */
export interface IGroupLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateGroupLookup<T extends object>(): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates group lookup field overloads.
 */
export const GROUP_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IGroupLookupProvider>('usermanagement.group.GroupLookupProvider');
