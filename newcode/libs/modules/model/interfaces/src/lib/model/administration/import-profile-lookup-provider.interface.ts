/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Provides options for import profile lookups.
 */
export interface IImportProfileLookupOptions extends ICommonLookupOptions {}

/**
 * Provides helper routines to generate lookups related to model import profiles.
 */
export interface IImportProfileLookupProvider {

	/**
	 * Generates a field/overload definition for a lookup related to model import profiles.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @param options An optional options object for the lookup.
	 *
	 * @returns The field/overload definition.
	 */
	generateImportProfileLookup<T extends object>(options?: IImportProfileLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection token to provide an object that helps to generate lookups
 * related to model import profiles.
 */
export const IMPORT_PROFILE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IImportProfileLookupProvider>('model.administration.importProfileLookupProvider');
