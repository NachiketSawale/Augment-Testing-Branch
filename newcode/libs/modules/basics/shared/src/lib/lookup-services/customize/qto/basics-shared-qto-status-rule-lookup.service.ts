/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtostatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'af71f20ee6c547e1b3e9bca1c0a9893f',
			valueMember: 'Id',
			displayMember: 'StatusFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusFk',
						model: 'StatusFk',
						type: FieldType.Quantity,
						label: { text: 'StatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StatusTargetFk',
						model: 'StatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'StatusTargetFk' },
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
