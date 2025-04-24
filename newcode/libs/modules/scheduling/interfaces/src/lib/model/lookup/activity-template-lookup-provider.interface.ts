/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for model lookups.
 */
export interface IActivityTemplateLookupOptions {

	/**
	 * list of ids from activity template group.
	 */
	templateGroup?: number[];
}

/**
 * Provides activity template lookups.
 */
export interface IActivityTemplateLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a template group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateActivityTemplateLookup<T extends object>(options?: IActivityTemplateLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates activity template lookup field overloads.
 */
export const ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IActivityTemplateLookupProvider>('scheduling.template.SchedulingActivityTemplateLookupProviderService');