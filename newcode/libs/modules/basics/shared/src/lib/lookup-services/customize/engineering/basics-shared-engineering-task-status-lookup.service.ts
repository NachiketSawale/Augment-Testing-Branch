/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringTaskStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringTaskStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringTaskStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringTaskStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringtaskstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0e5fadf58b5b4f73a7d0e8460ddcc523',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'Isdeletable',
						model: 'Isdeletable',
						type: FieldType.Boolean,
						label: { text: 'Isdeletable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Showintasklist',
						model: 'Showintasklist',
						type: FieldType.Boolean,
						label: { text: 'Showintasklist' },
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
						id: 'Backgroundcolor',
						model: 'Backgroundcolor',
						type: FieldType.Quantity,
						label: { text: 'Backgroundcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEngineering',
						model: 'IsEngineering',
						type: FieldType.Boolean,
						label: { text: 'IsEngineering' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEngineered',
						model: 'IsEngineered',
						type: FieldType.Boolean,
						label: { text: 'IsEngineered' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
