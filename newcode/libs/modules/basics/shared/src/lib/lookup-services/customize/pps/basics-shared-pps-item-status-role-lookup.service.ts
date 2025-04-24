/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsItemStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsItemStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsItemStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsItemStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsitemstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '52e0e5d22eb34010b2838a42286effa9',
			valueMember: 'Id',
			displayMember: 'ItemStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ItemStatusruleFk',
						model: 'ItemStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ItemStatusruleFk' },
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
