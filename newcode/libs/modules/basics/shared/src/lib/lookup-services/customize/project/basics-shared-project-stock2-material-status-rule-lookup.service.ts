/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStock2MaterialStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStock2MaterialStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStock2MaterialStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStock2MaterialStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectstock2materialstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8a9023a3219e4d738870e76143677e1f',
			valueMember: 'Id',
			displayMember: 'Stock2MaterialStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'Stock2MaterialStatusFk',
						model: 'Stock2MaterialStatusFk',
						type: FieldType.Quantity,
						label: { text: 'Stock2MaterialStatusFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Stock2MaterialStatusTargetFk',
						model: 'Stock2MaterialStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'Stock2MaterialStatusTargetFk' },
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
					}
				]
			}
		});
	}
}
