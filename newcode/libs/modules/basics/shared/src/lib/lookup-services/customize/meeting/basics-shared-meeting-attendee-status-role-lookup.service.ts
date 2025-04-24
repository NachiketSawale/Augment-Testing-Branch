/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMeetingAttendeeStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMeetingAttendeeStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMeetingAttendeeStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMeetingAttendeeStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/meetingattendeestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b93e248452394ca9b2fd8f8fe94a61b1',
			valueMember: 'Id',
			displayMember: 'AttendeeStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'AttendeeStatusRuleFk',
						model: 'AttendeeStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'AttendeeStatusRuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
