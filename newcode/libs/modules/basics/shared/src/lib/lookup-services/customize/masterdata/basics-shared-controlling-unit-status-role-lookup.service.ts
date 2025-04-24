/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingUnitStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingUnitStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingUnitStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingUnitStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/controllingunitstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7c1b89f6765f451da2b48c74afc8dc9c',
			valueMember: 'Id',
			displayMember: 'ContrunitstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ContrunitstatusruleFk',
						model: 'ContrunitstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ContrunitstatusruleFk' },
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
