/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMeetingStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMeetingStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMeetingStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMeetingStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/meetingstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'dd21b10f59214b2d9a17571e1127cf8c',
			valueMember: 'Id',
			displayMember: 'StatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusruleFk',
						model: 'StatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'StatusruleFk' },
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
