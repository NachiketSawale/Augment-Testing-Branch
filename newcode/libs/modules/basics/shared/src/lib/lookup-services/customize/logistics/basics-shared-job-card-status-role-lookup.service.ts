/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobCardStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobCardStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobCardStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobCardStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobcardstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '24377ec0b00b4d2ca458ce89622e2b3f',
			valueMember: 'Id',
			displayMember: 'JobcardstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'JobcardstatusruleFk',
						model: 'JobcardstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'JobcardstatusruleFk' },
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
