/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingActivityStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingActivityStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingActivityStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingActivityStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingactivitystatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'be5f29b16aa04a8393232263fc6bf87c',
			valueMember: 'Id',
			displayMember: 'ActStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ActStatusruleFk',
						model: 'ActStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ActStatusruleFk' },
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
