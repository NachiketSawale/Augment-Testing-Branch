/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resrequisitionstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '741f8d9ff8ea4ec0a167915113b76d6d',
			valueMember: 'Id',
			displayMember: 'RequisitionstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'RequisitionstatusFk',
						model: 'RequisitionstatusFk',
						type: FieldType.Quantity,
						label: { text: 'RequisitionstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RequisitionstatusTargetFk',
						model: 'RequisitionstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'RequisitionstatusTargetFk' },
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
