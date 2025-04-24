/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/schedulestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3d1d73bfaf304971a415b747854ebe91',
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
						id: 'Isplanningfinished',
						model: 'Isplanningfinished',
						type: FieldType.Boolean,
						label: { text: 'Isplanningfinished' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinexecution',
						model: 'Isinexecution',
						type: FieldType.Boolean,
						label: { text: 'Isinexecution' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isexecuted',
						model: 'Isexecuted',
						type: FieldType.Boolean,
						label: { text: 'Isexecuted' },
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
