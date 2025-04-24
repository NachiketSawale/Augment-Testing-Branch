/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingPeriodStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingPeriodStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingPeriodStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingPeriodStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingperiodstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b06ed241c3a948deb7a017260d22008e',
			valueMember: 'Id',
			displayMember: 'PeriodStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PeriodStatusRuleFk',
						model: 'PeriodStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusRuleFk' },
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
