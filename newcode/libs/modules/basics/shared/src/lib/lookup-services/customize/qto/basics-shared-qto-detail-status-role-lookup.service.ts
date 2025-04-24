/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoDetailStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoDetailStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoDetailStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoDetailStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtodetailstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7f2154201e8e4bcda77076d7000e9fa9',
			valueMember: 'Id',
			displayMember: 'DetailStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'DetailStatusRuleFk',
						model: 'DetailStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'DetailStatusRuleFk' },
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
