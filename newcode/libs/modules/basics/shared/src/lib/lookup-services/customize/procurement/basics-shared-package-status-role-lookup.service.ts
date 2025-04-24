/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePackageStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePackageStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPackageStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePackageStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/packagestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3f8809c555a14f3bbcefd4d8b256cc30',
			valueMember: 'Id',
			displayMember: 'PackagestatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'PackagestatusruleFk',
						model: 'PackagestatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'PackagestatusruleFk' },
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
