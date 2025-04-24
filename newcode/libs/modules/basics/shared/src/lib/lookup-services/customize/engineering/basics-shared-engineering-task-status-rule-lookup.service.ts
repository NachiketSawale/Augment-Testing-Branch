/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringTaskStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringTaskStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringTaskStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringTaskStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringtaskstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '20af4506f28a4392a34762534d031065',
			valueMember: 'Id',
			displayMember: 'AccessrightDescriptorFk',
			gridConfig: {
				columns: [
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
						id: 'TaskStatusFk',
						model: 'TaskStatusFk',
						type: FieldType.Quantity,
						label: { text: 'TaskStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TaskStatusTargetFk',
						model: 'TaskStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'TaskStatusTargetFk' },
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
