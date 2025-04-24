/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for timekeeping TimeSymbol2Group lookup.
 */
export interface ITimekeepingGroupLookupOptions {

}

/**
 * Provides TimeSymbol2Group lookups.
 */
export interface ITimekeepingGroupLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an TimeSymbol2Group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateTimekeepingGroupLookup<T extends object>(options?: ITimekeepingGroupLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates employee certification lookup field overloads.
 */
export const TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ITimekeepingGroupLookupProvider>('timekeeping.timesymbols.TimekeepingGroupLookupProvider');
