/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsClaimStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsClaimStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsClaimStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsClaimStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticsclaimstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '83e06a21eb0049468fb7aed1c1fca20d',
			valueMember: 'Id',
			displayMember: 'ClaimStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ClaimStatusRuleFk',
						model: 'ClaimStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'ClaimStatusRuleFk' },
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
