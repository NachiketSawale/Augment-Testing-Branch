/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/activitystatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '45aade5258c0404eb63281145301b7ae',
			valueMember: 'Id',
			displayMember: 'ActivitystateruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ActivitystateruleFk',
						model: 'ActivitystateruleFk',
						type: FieldType.Quantity,
						label: { text: 'ActivitystateruleFk' },
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
