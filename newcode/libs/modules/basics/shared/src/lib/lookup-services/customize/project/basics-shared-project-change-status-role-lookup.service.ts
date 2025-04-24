/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChangeStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChangeStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChangeStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChangeStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectchangestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '196b10cef3df4e8ba1f50e8f02f5fdaa',
			valueMember: 'Id',
			displayMember: 'ChangestatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ChangestatusruleFk',
						model: 'ChangestatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ChangestatusruleFk' },
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
