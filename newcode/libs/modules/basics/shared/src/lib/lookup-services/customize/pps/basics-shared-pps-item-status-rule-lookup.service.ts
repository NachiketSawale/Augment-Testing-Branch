/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsItemStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsItemStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsItemStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsItemStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsitemstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e21e5a1c07574ac48e45c8d7e27260ab',
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
						id: 'ItemStatusFk',
						model: 'ItemStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ItemStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ItemStatusTargetFk',
						model: 'ItemStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ItemStatusTargetFk' },
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
