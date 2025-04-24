/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling calendar lookup.
 */
export interface ISchedulingCalendarLookupOptions {

	/**
	 * Calendar id from activity.
	 */
	projectId?: number;
}

/**
 * Provides schedule lookups.
 */
export interface ISchedulingCalendarLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateCalendarLookup<T extends object>(options?: ISchedulingCalendarLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates calendar lookup field overloads.
 */
export const CALENDAR_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingCalendarLookupProvider>('scheduling.calendar.SchedulingCalendarLookupProviderService');
