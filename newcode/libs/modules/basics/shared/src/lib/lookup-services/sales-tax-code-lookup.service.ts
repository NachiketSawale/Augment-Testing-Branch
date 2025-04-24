/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {Injectable} from '@angular/core';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

/**
 * Basics Shared Sales Tax Code Group Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedSalesTaxCodeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IMdcSalesTaxCodeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super({httpRead:  { route: 'basics/salestaxcode/', endPointRead: 'lookuplist' }}, {
			uuid: '35ceaa7119114b2696a8b5b2ddabccd2',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100
					},
					{
						id: 'descriptioninfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 300
					},
					{
						id: 'TaxPercent',
						model: 'TaxPercent',
						type: FieldType.Quantity,
						label: { text: 'Original Percentage', key: 'cloud.common.entityTaxPercent' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100
					},
					{
						id: 'CalculationOrder',
						model: 'CalculationOrder',
						type: FieldType.Integer,
						label: { text: 'CalculationOrder', key: 'cloud.common.entityCalculationOrder' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100
					}
				]
			}
		});
	}
}