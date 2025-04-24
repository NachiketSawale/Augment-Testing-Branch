/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleImportConfEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleImportConfEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleImportConfLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleImportConfEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/scheduleimportconf/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1d9a4c0014444e0c8c5e34cbd3a8ad34',
			valueMember: 'Id',
			displayMember: 'ScheduleimportpropFk',
			gridConfig: {
				columns: [
					{
						id: 'ScheduleimportpropFk',
						model: 'ScheduleimportpropFk',
						type: FieldType.Quantity,
						label: { text: 'ScheduleimportpropFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefnumber',
						model: 'Userdefnumber',
						type: FieldType.Quantity,
						label: { text: 'Userdefnumber' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
