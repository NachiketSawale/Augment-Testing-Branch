/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportRequisitionStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportRequisitionStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportRequisitionStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportRequisitionStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportrequisitionstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b8311ebfcbad4340a6141d8afc48d0aa',
			valueMember: 'Id',
			displayMember: 'ReqStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ReqStatusFk',
						model: 'ReqStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReqStatusTargetFk',
						model: 'ReqStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusTargetFk' },
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
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
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
