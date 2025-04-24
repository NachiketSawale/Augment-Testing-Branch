/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChangeStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChangeStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChangeStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChangeStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectchangestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '018bafecce194d50a8d5aa299058c120',
			valueMember: 'Id',
			displayMember: 'ChangestatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ChangestatusFk',
						model: 'ChangestatusFk',
						type: FieldType.Quantity,
						label: { text: 'ChangestatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ChangestatusTargetFk',
						model: 'ChangestatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ChangestatusTargetFk' },
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
