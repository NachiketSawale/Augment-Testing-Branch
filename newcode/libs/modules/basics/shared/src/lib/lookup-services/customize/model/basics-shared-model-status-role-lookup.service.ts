/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a90c6eeb58c44a60a25dc4e8d4577441',
			valueMember: 'Id',
			displayMember: 'StatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusruleFk',
						model: 'StatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'StatusruleFk' },
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
