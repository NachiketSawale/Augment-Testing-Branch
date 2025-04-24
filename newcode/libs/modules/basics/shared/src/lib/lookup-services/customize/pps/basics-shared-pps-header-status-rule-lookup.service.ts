/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsHeaderStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsHeaderStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsHeaderStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsHeaderStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsheaderstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'dc31fc8acb504281807ca9d9f9bfb7cb',
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
						id: 'HeaderStatusFk',
						model: 'HeaderStatusFk',
						type: FieldType.Quantity,
						label: { text: 'HeaderStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HeaderStatusTargetFk',
						model: 'HeaderStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'HeaderStatusTargetFk' },
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
