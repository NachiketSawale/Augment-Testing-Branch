/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ModelPropertyValueBaseType } from './model-property-value-base-type.enum';

/**
 * Options for model property key lookups.
 */
export interface IPropertyKeyLookupOptions extends ICommonLookupOptions {

	/**
	 * If set, only property keys of the specified base value type will be eligible.
	 */
	restrictToBaseType?: ModelPropertyValueBaseType;
}

/**
 * Provides model property key lookups.
 */
export interface IPropertyKeyLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a model property key.
	 *
	 * @typeParam T The entity type that contains the reference.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generatePropertyKeyLookup<T extends object>(options?: IPropertyKeyLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates model property key lookup field overloads.
 */
export const PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IPropertyKeyLookupProvider>('model.administration.PropertyKeyLookupProvider');
