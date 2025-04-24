/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsUpstreamItemStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsUpstreamItemStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsUpstreamItemStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsUpstreamItemStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsupstreamitemstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c8fbe9c8b77046bb934b92edd0737818',
			valueMember: 'Id',
			displayMember: 'UpstreamItemStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'UpstreamItemStatusFk',
						model: 'UpstreamItemStatusFk',
						type: FieldType.Quantity,
						label: { text: 'UpstreamItemStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UpstreamItemStatusTargetFk',
						model: 'UpstreamItemStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'UpstreamItemStatusTargetFk' },
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
