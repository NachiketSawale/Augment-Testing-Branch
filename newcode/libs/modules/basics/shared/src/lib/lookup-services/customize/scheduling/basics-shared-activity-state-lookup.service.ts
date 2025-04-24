/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityStateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityStateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityStateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityStateEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/activitystate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b4a5db5775f84d108cd01423e150f51d',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isautomatic',
						model: 'Isautomatic',
						type: FieldType.Boolean,
						label: { text: 'Isautomatic' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isstarted',
						model: 'Isstarted',
						type: FieldType.Boolean,
						label: { text: 'Isstarted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdelayed',
						model: 'Isdelayed',
						type: FieldType.Boolean,
						label: { text: 'Isdelayed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isahead',
						model: 'Isahead',
						type: FieldType.Boolean,
						label: { text: 'Isahead' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isfinished',
						model: 'Isfinished',
						type: FieldType.Boolean,
						label: { text: 'Isfinished' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isfinisheddelayed',
						model: 'Isfinisheddelayed',
						type: FieldType.Boolean,
						label: { text: 'Isfinisheddelayed' },
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
						id: 'Isplanningfinished',
						model: 'Isplanningfinished',
						type: FieldType.Boolean,
						label: { text: 'Isplanningfinished' },
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
					}
				]
			}
		});
	}
}
