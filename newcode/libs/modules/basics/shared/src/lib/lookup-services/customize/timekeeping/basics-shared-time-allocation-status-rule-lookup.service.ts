/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeAllocationStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeAllocationStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeAllocationStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeAllocationStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timeallocationstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '81973c7d7d134b2694e0e5d726e7c055',
			valueMember: 'Id',
			displayMember: 'TimeAllocationStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'TimeAllocationStatusFk',
						model: 'TimeAllocationStatusFk',
						type: FieldType.Quantity,
						label: { text: 'TimeAllocationStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TimeAllocationStatusTargetFk',
						model: 'TimeAllocationStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'TimeAllocationStatusTargetFk' },
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
