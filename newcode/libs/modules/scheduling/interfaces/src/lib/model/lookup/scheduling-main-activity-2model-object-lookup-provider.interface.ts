/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling main activity2model object lookup.
 */
export interface ISchedulingMainActivity2ModelObjectLookupOptions {

}

/**
 * Provides scheduling main activity2model lookups.
 */
export interface ISchedulingMainActivity2ModelObjectLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity2model.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateSchedulingMainActivity2ModelObjectLookup<T extends object>(options?: ISchedulingMainActivity2ModelObjectLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates activity2model lookup field overloads.
 */
export const SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingMainActivity2ModelObjectLookupProvider>('scheduling.main.SchedulingMainActivity2ModelObjectLookupProvider');
