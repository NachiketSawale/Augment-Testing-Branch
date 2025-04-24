/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8415c1de2f014d3f8ed20c797a1fd6ba',
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
