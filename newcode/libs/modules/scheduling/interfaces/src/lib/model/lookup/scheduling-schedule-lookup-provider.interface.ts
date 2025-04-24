/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling schedule lookup.
 */
export interface ISchedulingScheduleLookupOptions {

	/**
	 * Schedule id from activity.
	 */
	projectId?: number;
	readonly?: boolean;
}

/**
 * Provides schedule lookups.
 */
export interface ISchedulingScheduleLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateScheduleLookup<T extends object>(options?: ISchedulingScheduleLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates schedule lookup field overloads.
 */
export const SCHEDULE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingScheduleLookupProvider>('scheduling.schedule.SchedulingScheduleLookupProviderService');
