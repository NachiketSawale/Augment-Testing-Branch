/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettlementStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettlementStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettlementStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettlementStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticssettlementstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e696b784f46f4c44a84b4235d4b01cb5',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBilled',
						model: 'IsBilled',
						type: FieldType.Boolean,
						label: { text: 'IsBilled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStorno',
						model: 'IsStorno',
						type: FieldType.Boolean,
						label: { text: 'IsStorno' },
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
						id: 'IsTestRun',
						model: 'IsTestRun',
						type: FieldType.Boolean,
						label: { text: 'IsTestRun' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevision',
						model: 'IsRevision',
						type: FieldType.Boolean,
						label: { text: 'IsRevision' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
