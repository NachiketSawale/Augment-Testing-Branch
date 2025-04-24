/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringTaskStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringTaskStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringTaskStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringTaskStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringtaskstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '394dba5908d1451d867a19481e14a2a9',
			valueMember: 'Id',
			displayMember: 'TaskStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'TaskStatusruleFk',
						model: 'TaskStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'TaskStatusruleFk' },
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
