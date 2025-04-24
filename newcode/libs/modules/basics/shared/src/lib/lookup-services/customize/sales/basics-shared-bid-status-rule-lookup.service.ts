/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBidStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBidStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBidStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBidStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bidstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ed1bb0bba73645019c1ef5d2b47dbadf',
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
