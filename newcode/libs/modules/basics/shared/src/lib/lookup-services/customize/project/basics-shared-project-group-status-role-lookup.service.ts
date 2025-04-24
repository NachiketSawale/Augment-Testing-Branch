/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectGroupStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectGroupStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectGroupStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectGroupStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectgroupstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3f0f1b64e6ef4e7985645b2110d61bde',
			valueMember: 'Id',
			displayMember: 'GroupStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'GroupStatusRuleFk',
						model: 'GroupStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'GroupStatusRuleFk' },
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
