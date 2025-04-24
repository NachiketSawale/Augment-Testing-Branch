/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWorkInProgressStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWorkInProgressStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWorkInProgressStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWorkInProgressStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/workinprogressstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2f972af27a5c48699a84ad62de61fa91',
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
