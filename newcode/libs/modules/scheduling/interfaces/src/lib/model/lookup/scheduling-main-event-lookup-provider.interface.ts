/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling main event lookup.
 */
export interface ISchedulingMainEventLookupOptions {
	preloadTranslation: string;
	showClearButton?: boolean;
}

/**
 * Provides scheduling main event lookups.
 */
export interface ISchedulingMainEventLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an event.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateSchedulingMainEventLookup<T extends object>(options: ISchedulingMainEventLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates event lookup field overloads.
 */
export const SCHEDULING_MAIN_EVENT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingMainEventLookupProvider>('scheduling.main.EventLookupProvider');
