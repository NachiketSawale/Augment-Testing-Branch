/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFormDataStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFormDataStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFormDataStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFormDataStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/formdatastatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2307903dea8f4519b907af5b6feb3653',
			valueMember: 'Id',
			displayMember: 'FormdataStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'FormdataStatusFk',
						model: 'FormdataStatusFk',
						type: FieldType.Quantity,
						label: { text: 'FormdataStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FormdataStatusTargetFk',
						model: 'FormdataStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'FormdataStatusTargetFk' },
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
