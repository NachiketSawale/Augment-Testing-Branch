/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/billstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '95900f3b085445dba799349fecdfb616',
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isbilled',
						model: 'Isbilled',
						type: FieldType.Boolean,
						label: { text: 'Isbilled' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isstorno',
						model: 'Isstorno',
						type: FieldType.Boolean,
						label: { text: 'Isstorno' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isarchived',
						model: 'Isarchived',
						type: FieldType.Boolean,
						label: { text: 'Isarchived' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isonlyfwd',
						model: 'Isonlyfwd',
						type: FieldType.Boolean,
						label: { text: 'Isonlyfwd' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isbtrequired',
						model: 'Isbtrequired',
						type: FieldType.Boolean,
						label: { text: 'Isbtrequired' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPosted',
						model: 'IsPosted',
						type: FieldType.Boolean,
						label: { text: 'IsPosted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevenueRecognition',
						model: 'IsRevenueRecognition',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueRecognition' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
