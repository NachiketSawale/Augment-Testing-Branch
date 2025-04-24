/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMaterialPriceVersionLookupEntity } from '@libs/basics/interfaces';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * Material Price Version lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialPriceVersionViewLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IMaterialPriceVersionLookupEntity, TEntity> {

	/**
	 * The constructor
	 */
	public constructor() {
		super('MaterialPriceVersion', {
			uuid: '3cf966cd641a44f584e10c71def5e090',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'MaterialPriceVersionDescriptionInfo.Translated',
			gridConfig: {
				columns: [
					{
						id: 'priceVersion',
						model: 'MaterialPriceVersionDescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: 'Price Version Description',
							key: 'basics.materialcatalog.priceVersionDescription'
						},
						width: 130,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'priceList',
						model: 'PriceListDescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: 'Price List Description',
							key: 'basics.materialcatalog.priceListDescription'
						},
						width: 120,
						visible: true,
						sortable: false,
						readonly: true
					}
				]
			}
		});
	}
}