/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';


/**
 * Resource Catalog Lookup Service
 */
@Injectable({
	providedIn: 'root'
})

export class ResourceSharedResourceCatalogLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceCatalogEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {route: 'resource/catalog/catalog/', endPointRead: 'searchlist'}
		}, {
			uuid: 'e384e8dce6c3437dabc82530b6321bd7',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'currencyFk',
						model: 'CurrencyFk',
						type: FieldType.Integer,
						label: {
							text: 'Currency',
							key: 'cloud.common.entityCurrency'
						},
						visible: true,
						sortable: false
					}
				]
			}
		});
	}
}