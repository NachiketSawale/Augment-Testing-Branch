/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '05ca56e35cb04a03af8dd8ec988e03fe',
			valueMember: 'Id',
			displayMember: 'JobstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'JobstatusruleFk',
						model: 'JobstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'JobstatusruleFk' },
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
