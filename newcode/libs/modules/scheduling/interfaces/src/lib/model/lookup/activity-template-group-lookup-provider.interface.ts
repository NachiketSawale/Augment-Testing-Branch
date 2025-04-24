/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for templategroup lookups.
 */
export interface IActivityTemplateGroupLookupOptions extends ICommonLookupOptions {

}

/**
 * Provides activity templategroup lookups.
 */
export interface IActivityTemplateGroupLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a template group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateActivityTemplateGroupLookup<T extends object>(options?: IActivityTemplateGroupLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates activity templategroup lookup field overloads.
 */
export const ACTIVITY_TEMPLATE_GROUP_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IActivityTemplateGroupLookupProvider>('scheduling.templategroup.ActivityTemplateGroupLookupProvider');
