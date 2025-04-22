/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { INamedItemEntityWithId, LazyInjectable } from '@libs/platform/common';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { IImportProfileLookupOptions, IImportProfileLookupProvider, IMPORT_PROFILE_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ModelAdministrationModelImportProfileLookupDataService } from './model-import-profile-lookup-data.service';

/**
 * A service that helps generate lookup fields/overloads related to model import profiles.
 */
@LazyInjectable({
	token: IMPORT_PROFILE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationModelImportProfileLookupProviderService implements IImportProfileLookupProvider {

	/**
	 * Generates a field/overload definition for a lookup related to model import profiles.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @param options An optional options object for the lookup.
	 *
	 * @returns The field/overload definition.
	 */
	public generateImportProfileLookup<T extends object>(options?: IImportProfileLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, INamedItemEntityWithId<number>>({
				dataServiceToken: ModelAdministrationModelImportProfileLookupDataService,
				showClearButton: !!options?.showClearButton
			})
		};
	}
}
