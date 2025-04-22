/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for model lookups.
 */
export interface IModelLookupOptions {

	/**
	 * If set, will list only models from the listed set of projects.
	 */
	restrictToProjectIds?: number[];

	/**
	 * If `true`, composite models will be included.
	 * The default value is `false`.
	 */
	includeComposite?: boolean;

	/**
	 * If `true`, 2D models will be included.
	 * The default value is `true`.
	 */
	include2D?: boolean;

	/**
	 * If `true`, 3D models will be included.
	 * The default value is `true`.
	 */
	include3D?: boolean;
}

/**
 * Provides model-related lookups.
 */
export interface IModelLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a model.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateModelLookup<T extends object>(options?: IModelLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates model lookup field overloads.
 */
export const MODEL_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IModelLookupProvider>('model.project.ModelLookupProvider');
