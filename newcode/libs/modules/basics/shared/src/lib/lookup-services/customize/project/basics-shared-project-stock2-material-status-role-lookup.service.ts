/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStock2MaterialStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStock2MaterialStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStock2MaterialStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStock2MaterialStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectstock2materialstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f23bc679b0704619af998ffd1d19c19a',
			valueMember: 'Id',
			displayMember: 'Stock2MaterialStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'Stock2MaterialStatusRuleFk',
						model: 'Stock2MaterialStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'Stock2MaterialStatusRuleFk' },
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
