/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/schedulestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8fc00b82917943859f829092735bcfdb',
			valueMember: 'Id',
			displayMember: 'SchedulestatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'SchedulestatusruleFk',
						model: 'SchedulestatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'SchedulestatusruleFk' },
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
