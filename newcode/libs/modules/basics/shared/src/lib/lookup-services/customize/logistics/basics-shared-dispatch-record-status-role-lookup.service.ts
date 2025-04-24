/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchRecordStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchRecordStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchRecordStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchRecordStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchrecordstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a3bf2468c41047b3b9daa04c20977101',
			valueMember: 'Id',
			displayMember: 'DspatchrecStatruleFk',
			gridConfig: {
				columns: [
					{
						id: 'DspatchrecStatruleFk',
						model: 'DspatchrecStatruleFk',
						type: FieldType.Quantity,
						label: { text: 'DspatchrecStatruleFk' },
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
