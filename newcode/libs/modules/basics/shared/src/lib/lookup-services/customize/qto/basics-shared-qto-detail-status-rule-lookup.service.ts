/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoDetailStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoDetailStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoDetailStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoDetailStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtodetailstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e0bb5f0c7a344e4da5d09025280ce5c4',
			valueMember: 'Id',
			displayMember: 'DetailStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'DetailStatusFk',
						model: 'DetailStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DetailStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DetailStatusTargetFk',
						model: 'DetailStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DetailStatusTargetFk' },
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
