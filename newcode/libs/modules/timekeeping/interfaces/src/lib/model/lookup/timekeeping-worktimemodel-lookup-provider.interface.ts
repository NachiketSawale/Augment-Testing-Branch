/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for timekeeping work time model lookup.
 */
export interface ITimekeepingWorkTimeModelLookupOptions {
	IsFallback?: boolean;
}

/**
 * Provides schedule lookups.
 */
export interface ITimekeepingWorkTimeModelFbLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a work time model.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateWorkTimeModelLookup<T extends object>(options?: ITimekeepingWorkTimeModelLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates calendar lookup field overloads.
 */
export const WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ITimekeepingWorkTimeModelFbLookupProvider>('timekeeping.worktimemodel.WorkTimeModelFbLookupProvider');
