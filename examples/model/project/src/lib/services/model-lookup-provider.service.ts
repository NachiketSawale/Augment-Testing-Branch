/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { IModelLookupOptions, IModelLookupProvider, MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ModelProjectModelHeaderLookupDataService } from './model-project-model-header-lookup-data.service';
import { IModelHeaderEntity } from '../model/entities/model-header-entity.interface';

/**
 * Provides model-related lookups.
 */
@LazyInjectable({
	token: MODEL_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelLookupProviderService implements IModelLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a model.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateModelLookup<T extends object>(options?: IModelLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IModelHeaderEntity>({
				dataServiceToken: ModelProjectModelHeaderLookupDataService,
				serverSideFilter: {
					key: 'model',
					execute: () => {
						return <IModelLookupOptions>{
							includeComposite: false,
							include2D: true,
							include3D: true,
							...options
						};
					}
				},
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'model.project.modelLookupHeader'}
				},
				gridConfig: {
					columns: [{
						id: 'code',
						label: {key: 'cloud.common.entityCode'},
						type: FieldType.Code,
						model: 'Code',
						sortable: true,
						width: 100
					}, {
						id: 'desc',
						label: {key: 'cloud.common.entityDescription'},
						type: FieldType.Description,
						model: 'Description',
						sortable: true,
						width: 220
					}, {
						id: 'composite',
						label: {key: 'model.project.isComposite'},
						type: FieldType.Boolean,
						model: 'IsComposite',
						sortable: true,
						width: 90
					}]
				}
			})
		};
	}
}
