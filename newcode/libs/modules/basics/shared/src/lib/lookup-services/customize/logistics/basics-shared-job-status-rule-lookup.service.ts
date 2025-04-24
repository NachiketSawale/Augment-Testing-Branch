/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7a0560974fb34ea085b408b35ec52e1c',
			valueMember: 'Id',
			displayMember: 'JobstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'JobstatusFk',
						model: 'JobstatusFk',
						type: FieldType.Quantity,
						label: { text: 'JobstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'JobstatusTargetFk',
						model: 'JobstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'JobstatusTargetFk' },
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
