/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelObjectSetStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelObjectSetStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelObjectSetStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelObjectSetStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelobjectsetstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7bc6a3d23ffb49eaa427e92fadae3ccb',
			valueMember: 'Id',
			displayMember: 'ObjectsetstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ObjectsetstatusruleFk',
						model: 'ObjectsetstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ObjectsetstatusruleFk' },
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
