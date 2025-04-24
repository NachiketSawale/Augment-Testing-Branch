/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling activity lookup.
 */
export interface ISchedulingActivityLookupOptions {

	/**
	 * Schedule id from activity.
	 */
	scheduleId?: number;
	readonly?: boolean;
	showClearButton?: boolean;
}

/**
 * Provides activity lookups.
 */
export interface ISchedulingActivityLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateActivityLookup<T extends object>(options?: ISchedulingActivityLookupOptions): TypedConcreteFieldOverload<T>;

	generateGridActivityLookup<T extends object>(options?: ISchedulingActivityLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates activity lookup field overloads.
 */
export const ACTIVITY_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingActivityLookupProvider>('scheduling.main.SchedulingActivityLookupProviderService');
