/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Represents an object that provides helper functions related to property key tags.
 */
export interface IModelAdministrationPropertyKeyTagHelper {

	/**
	 * Generates a field overload to edit property key tags.
	 *
	 * @typeParam T The entity type.
	 */
	generateTagsFieldOverload<T extends object>(): TypedConcreteFieldOverload<T>;
}

export const PROPERTY_KEY_TAG_HELPER_TOKEN = new LazyInjectionToken<IModelAdministrationPropertyKeyTagHelper>('model.administration.propKeyTagHelper');
