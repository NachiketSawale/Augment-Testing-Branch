/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderPaymentSchedulesStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/orderpaymentschedulesstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '30b7c6c7e29a47a08f7a5905c947ad90',
			valueMember: 'Id',
			displayMember: 'PsStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PsStatusRuleFk',
						model: 'PsStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PsStatusRuleFk' },
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
