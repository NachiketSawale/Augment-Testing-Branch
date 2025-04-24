/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingRecordingStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingRecordingStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingRecordingStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingRecordingStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingrecordingstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2bf5256f8277464dbc157084f2cf6e67',
			valueMember: 'Id',
			displayMember: 'RecordingStatRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'RecordingStatRuleFk',
						model: 'RecordingStatRuleFk',
						type: FieldType.Quantity,
						label: { text: 'RecordingStatRuleFk' },
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
