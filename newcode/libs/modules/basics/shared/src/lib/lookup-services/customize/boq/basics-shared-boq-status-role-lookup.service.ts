/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/boqstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eab96c04a6f94065accaa01363531a88',
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
