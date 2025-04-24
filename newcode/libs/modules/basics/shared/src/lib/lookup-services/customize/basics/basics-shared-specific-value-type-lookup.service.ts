/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSpecificValueTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSpecificValueTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSpecificValueTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSpecificValueTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/specificvaluetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '70efd919ed8845fda21018110c851cde',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCostCode',
						model: 'IsCostCode',
						type: FieldType.Boolean,
						label: { text: 'IsCostCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPerformance',
						model: 'IsPerformance',
						type: FieldType.Boolean,
						label: { text: 'IsPerformance' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEmmission',
						model: 'IsEmmission',
						type: FieldType.Boolean,
						label: { text: 'IsEmmission' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCatalogEstimate',
						model: 'IsCatalogEstimate',
						type: FieldType.Boolean,
						label: { text: 'IsCatalogEstimate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFixedCost',
						model: 'IsFixedCost',
						type: FieldType.Boolean,
						label: { text: 'IsFixedCost' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
