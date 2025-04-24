/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsItemStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsItemStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsItemStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsItemStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsitemstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7f5584858b96474b84f1bb64b95a55e4',
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
						id: 'BackgroundColor',
						model: 'BackgroundColor',
						type: FieldType.Quantity,
						label: { text: 'BackgroundColor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FontColor',
						model: 'FontColor',
						type: FieldType.Quantity,
						label: { text: 'FontColor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInProduction',
						model: 'IsInProduction',
						type: FieldType.Boolean,
						label: { text: 'IsInProduction' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDeletable',
						model: 'IsDeletable',
						type: FieldType.Boolean,
						label: { text: 'IsDeletable' },
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
						id: 'Userflag1',
						model: 'Userflag1',
						type: FieldType.Boolean,
						label: { text: 'Userflag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag2',
						model: 'Userflag2',
						type: FieldType.Boolean,
						label: { text: 'Userflag2' },
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
						id: 'IsMergeAllowed',
						model: 'IsMergeAllowed',
						type: FieldType.Boolean,
						label: { text: 'IsMergeAllowed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDone',
						model: 'IsDone',
						type: FieldType.Boolean,
						label: { text: 'IsDone' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForAutoAssignProduct',
						model: 'IsForAutoAssignProduct',
						type: FieldType.Boolean,
						label: { text: 'IsForAutoAssignProduct' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isforpreliminary',
						model: 'Isforpreliminary',
						type: FieldType.Boolean,
						label: { text: 'Isforpreliminary' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
