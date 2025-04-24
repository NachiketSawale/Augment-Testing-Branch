/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { IDataTreeLevelEntity } from '../model/entities/data-tree-level-entity.interface';
import { ModelAdministrationDataTreeLevelLookupDataService } from './data-tree-level-lookup-data.service';

/**
 * A service that provides lookups related to model data trees.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTreeLookupProviderService {

	/**
	 * Provides a field/overload definition for a data tree level lookup.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @returns The field/overload definition.
	 */
	public generateDataTreeLevelLookup<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IDataTreeLevelEntity>({
				dataServiceToken: ModelAdministrationDataTreeLevelLookupDataService
			})
		};
	}
}
