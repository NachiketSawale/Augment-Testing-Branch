/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMainStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMainStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMainStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMainStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mainstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7ed2406cc28a47d186b43f72bf0726ed',
			valueMember: 'Id',
			displayMember: 'MaintstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'MaintstatusruleFk',
						model: 'MaintstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'MaintstatusruleFk' },
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
