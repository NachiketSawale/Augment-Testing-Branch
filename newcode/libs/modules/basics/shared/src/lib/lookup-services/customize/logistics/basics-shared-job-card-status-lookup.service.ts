/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobCardStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobCardStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobCardStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobCardStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobcardstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a55174f431f8465da636c0576cf927d9',
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
						id: 'IsCharged',
						model: 'IsCharged',
						type: FieldType.Boolean,
						label: { text: 'IsCharged' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStockRelevant',
						model: 'IsStockRelevant',
						type: FieldType.Boolean,
						label: { text: 'IsStockRelevant' },
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
						id: 'IsReadyForDispatching',
						model: 'IsReadyForDispatching',
						type: FieldType.Boolean,
						label: { text: 'IsReadyForDispatching' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDispatched',
						model: 'IsDispatched',
						type: FieldType.Boolean,
						label: { text: 'IsDispatched' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
					}
				]
			}
		});
	}
}
