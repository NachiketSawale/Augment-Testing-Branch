/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingActivityStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingActivityStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingActivityStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingActivityStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingactivitystatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '406aa005100d4d3d8271c9a73a88ffd3',
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
						id: 'ActStatusFk',
						model: 'ActStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ActStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ActStatusTargetFk',
						model: 'ActStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ActStatusTargetFk' },
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
