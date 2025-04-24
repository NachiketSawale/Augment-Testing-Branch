/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCosInstHeaderStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCosInstHeaderStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCosInstHeaderStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCosInstHeaderStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/cosinstheaderstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2e3c3577590441baad6078eb7b4c5dfb',
			valueMember: 'Id',
			displayMember: 'InsheadstateruleFk',
			gridConfig: {
				columns: [
					{
						id: 'InsheadstateruleFk',
						model: 'InsheadstateruleFk',
						type: FieldType.Quantity,
						label: { text: 'InsheadstateruleFk' },
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
