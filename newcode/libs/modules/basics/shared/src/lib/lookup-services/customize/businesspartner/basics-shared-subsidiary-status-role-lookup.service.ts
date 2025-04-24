/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSubsidiaryStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSubsidiaryStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSubsidiaryStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSubsidiaryStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/subsidiarystatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b4ced5b800314216915e45ca08ac6488',
			valueMember: 'Id',
			displayMember: 'SubsidiaryStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'SubsidiaryStatusRuleFk',
						model: 'SubsidiaryStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'SubsidiaryStatusRuleFk' },
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
