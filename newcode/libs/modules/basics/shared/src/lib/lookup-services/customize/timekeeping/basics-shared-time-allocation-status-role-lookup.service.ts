/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeAllocationStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeAllocationStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeAllocationStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeAllocationStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timeallocationstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6818996ceabf4480871368ee4019f53d',
			valueMember: 'Id',
			displayMember: 'TimeAllocationStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'TimeAllocationStatusRuleFk',
						model: 'TimeAllocationStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'TimeAllocationStatusRuleFk' },
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
