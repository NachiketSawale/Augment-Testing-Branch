/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aa5a8293863d44c68f2ef8b9bed18a35',
			valueMember: 'Id',
			displayMember: 'DispatchStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'DispatchStatusruleFk',
						model: 'DispatchStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'DispatchStatusruleFk' },
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
