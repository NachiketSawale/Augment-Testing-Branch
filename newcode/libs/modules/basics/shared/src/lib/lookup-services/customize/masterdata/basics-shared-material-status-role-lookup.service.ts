/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/materialstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b6f5d1cc2ee3463aaa0d2348b0e99e4c',
			valueMember: 'Id',
			displayMember: 'MaterialStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'MaterialStatusRuleFk',
						model: 'MaterialStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'MaterialStatusRuleFk' },
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
