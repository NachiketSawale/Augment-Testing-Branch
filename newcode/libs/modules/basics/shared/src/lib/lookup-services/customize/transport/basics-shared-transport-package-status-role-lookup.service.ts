/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportPackageStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportPackageStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportPackageStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportPackageStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportpackagestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ac742566ee4748d98d200f9cbb2e7071',
			valueMember: 'Id',
			displayMember: 'PkgStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'PkgStatusruleFk',
						model: 'PkgStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'PkgStatusruleFk' },
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
