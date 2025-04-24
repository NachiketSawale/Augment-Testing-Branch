/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for timekeeping crew leader lookup.
 */
export interface ITimekeepingCrewLeaderLookupOptions {
	preloadTranslation: string;
}

/**
 * Provides crew leader lookups.
 */
export interface ITimekeepingCrewLeaderLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a crew leader.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateCrewLeaderLookup<T extends object>(options: ITimekeepingCrewLeaderLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates crew leader lookup field overloads.
 */
export const CREW_LEADER_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ITimekeepingCrewLeaderLookupProvider>('timekeeping.employee.TimekeepingCrewLeaderLookupProvider');
