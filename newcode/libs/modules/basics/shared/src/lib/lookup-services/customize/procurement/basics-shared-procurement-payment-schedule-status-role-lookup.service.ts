/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementPaymentScheduleStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementpaymentschedulestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f310b680deff48cfb8048991fe48b081',
			valueMember: 'Id',
			displayMember: 'PaymentScheduleStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PaymentScheduleStatusRuleFk',
						model: 'PaymentScheduleStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PaymentScheduleStatusRuleFk' },
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
