/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	ILookupDialogSearchFormEntity,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPropertyKeyLookupOptions, IPropertyKeyLookupProvider, PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ModelAdministrationPropertyKeyLookupDataService } from './property-key-lookup-data.service';
import { IPropertyKeyEntity } from '../model/entities/property-key-entity.interface';
import { ModelAdministrationPropertyKeyTagHelperService } from './property-key-tag-helper.service';

/**
 * Provides model property key lookups.
 */
@LazyInjectable({
	token: PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyLookupProviderService implements IPropertyKeyLookupProvider {

	private readonly pkTagHelperSvc = inject(ModelAdministrationPropertyKeyTagHelperService);

	/**
	 * Generates a lookup field overload definition to pick a model property key.
	 *
	 * @typeParam T The entity type that contains the reference.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generatePropertyKeyLookup<T extends object>(options?: IPropertyKeyLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IPropertyKeyEntity>({
				dataServiceToken: ModelAdministrationPropertyKeyLookupDataService,
				showClearButton: options?.showClearButton,
				serverSideFilter: {
					key: 'model.propKeyDefaultLookup',
					execute: () => {
						return <IPropertyKeyLookupOptions>{
							...options
						};
					}
				},
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'model.administration.selectPropKey'}
				},
				dialogSearchForm: {
					form: {
						entity: () => {
							const result: ILookupDialogSearchFormEntity = {};

							if (options?.restrictToBaseType) {
								result['BaseValueTypeFk'] = options.restrictToBaseType;
							}

							return result;
						},
						config: {
							groups: [{groupId: 'default'}],
							rows: [{
								id: 'baseType',
								groupId: 'default',
								...BasicsSharedCustomizeLookupOverloadProvider.provideModelBaseValueTypeLookupOverload(true),
								model: 'BaseValueTypeFk',
								label: {key: 'model.administration.baseValueType'},
								readonly: !!options?.restrictToBaseType
							}, {
								id: 'type',
								groupId: 'default',
								...BasicsSharedCustomizeLookupOverloadProvider.provideModelValueTypeLookupOverload(true),
								model: 'ValueTypeFk',
								label: {key: 'model.administration.propertyValueType'}
							}, {
								id: 'tags',
								groupId: 'default',
								...this.pkTagHelperSvc.generateTagsFieldOverload(),
								model: 'PkTagIds',
								label: {key: 'model.administration.propertyKeys.tags'}
							}]
						}
					}
				},
				gridConfig: {
					columns: [{
						id: 'propName',
						label: {key: 'cloud.common.entityName'},
						type: FieldType.Description,
						model: 'PropertyName',
						sortable: true,
						width: 240
					}, {
						id: 'vt',
						label: {key: 'model.administration.propertyValueType'},
						model: 'ValueTypeFk',
						sortable: true,
						width: 150,
						...BasicsSharedCustomizeLookupOverloadProvider.provideModelValueTypeReadonlyLookupOverload()
					}]
				}
			})
		};
	}
}
