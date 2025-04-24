/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeHsqeChecklistStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeHsqeChecklistStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedHsqeChecklistStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeHsqeChecklistStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/hsqecheckliststatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5694ebff5ab546618db9de3433800cc5',
			valueMember: 'Id',
			displayMember: 'ChlStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ChlStatusRuleFk',
						model: 'ChlStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'ChlStatusRuleFk' },
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
