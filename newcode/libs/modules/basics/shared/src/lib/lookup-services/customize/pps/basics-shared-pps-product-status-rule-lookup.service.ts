/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4dee3dbffe034833aeda1bd6ed7f06e7',
			valueMember: 'Id',
			displayMember: 'ProductStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductStatusFk',
						model: 'ProductStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ProductStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ProductStatusTargetFk',
						model: 'ProductStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ProductStatusTargetFk' },
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
