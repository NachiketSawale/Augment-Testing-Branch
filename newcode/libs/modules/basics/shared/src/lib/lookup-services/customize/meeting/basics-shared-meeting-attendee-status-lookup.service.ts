/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMeetingAttendeeStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMeetingAttendeeStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMeetingAttendeeStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMeetingAttendeeStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/meetingattendeestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3c299c230095486d861dde405b94228e',
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
					}
				]
			}
		});
	}
}
