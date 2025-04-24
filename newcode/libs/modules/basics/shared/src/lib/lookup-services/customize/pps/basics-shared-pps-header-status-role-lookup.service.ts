/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsHeaderStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsHeaderStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsHeaderStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsHeaderStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsheaderstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '72122dddeaf0486ebef7848c22e9a87b',
			valueMember: 'Id',
			displayMember: 'HeaderStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'HeaderStatusruleFk',
						model: 'HeaderStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'HeaderStatusruleFk' },
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
