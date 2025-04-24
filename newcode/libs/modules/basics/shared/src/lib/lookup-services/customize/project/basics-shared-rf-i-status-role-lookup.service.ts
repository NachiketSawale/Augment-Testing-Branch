/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfIStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfIStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfIStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfIStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfistatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a860c6eb1829493783ba9e9f189deb49',
			valueMember: 'Id',
			displayMember: 'RfistatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'RfistatusruleFk',
						model: 'RfistatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'RfistatusruleFk' },
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
