/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEvaluationStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEvaluationStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEvaluationStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEvaluationStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/evaluationstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8d656ac3eca64fe8bfdd6b6551015ac2',
			valueMember: 'Id',
			displayMember: 'EvalstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'EvalstatusFk',
						model: 'EvalstatusFk',
						type: FieldType.Quantity,
						label: { text: 'EvalstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EvalstatusTargetFk',
						model: 'EvalstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'EvalstatusTargetFk' },
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
