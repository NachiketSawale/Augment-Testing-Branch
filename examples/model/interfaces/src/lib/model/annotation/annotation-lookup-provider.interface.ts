/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for model annotation lookups.
 */
export interface IAnnotationLookupOptions extends ICommonLookupOptions {

	/**
	 * If assigned, only annotations from models out of a given set of
	 * projects will be considered.
	 */
	restrictToProjectIds?: number[];

	/**
	 * If assigned, only annotations from a given set of models (or their
	 * sub-models, depending on the {@link includeSubModels} value) will
	 * be considered.
	 */
	restrictToModelIds?: number[];

	/**
	 * Determines whether sub-models of models the search is restricted to
	 * will be considered as annotation parents, as well.
	 */
	includeSubModels?: boolean;
}

/**
 * Provides model annotation lookups.
 */
export interface IAnnotationLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a model annotation.
	 *
	 * @typeParam T The entity type that contains the reference.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateAnnotationLookup<T extends object>(options?: IAnnotationLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates model annotation lookup field overloads.
 */
export const ANNOTATION_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IAnnotationLookupProvider>('model.annotation.AnnotationLookupProvider');
