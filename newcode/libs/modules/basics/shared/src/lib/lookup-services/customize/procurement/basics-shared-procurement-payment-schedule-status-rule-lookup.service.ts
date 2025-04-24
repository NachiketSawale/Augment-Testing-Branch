/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementPaymentScheduleStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementpaymentschedulestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6b2839ba92344cc2b1737cd3d06bbf57',
			valueMember: 'Id',
			displayMember: 'PaymentScheduleStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PaymentScheduleStatusFk',
						model: 'PaymentScheduleStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PaymentScheduleStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PaymentScheduleStatusTargetFk',
						model: 'PaymentScheduleStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PaymentScheduleStatusTargetFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Hasrolevalidation',
						model: 'Hasrolevalidation',
						type: FieldType.Boolean,
						label: { text: 'Hasrolevalidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
