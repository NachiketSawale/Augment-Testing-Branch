/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderPaymentSchedulesStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/orderpaymentschedulesstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eafd8742d69840f796b73f4c268fc050',
			valueMember: 'Id',
			displayMember: 'PsStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PsStatusFk',
						model: 'PsStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PsStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PsStatusTargetFk',
						model: 'PsStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PsStatusTargetFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
