/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfIStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfIStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfIStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfIStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfistatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c4d6a851255642ee8fd5c6d185c9f162',
			valueMember: 'Id',
			displayMember: 'RfistatusFk',
			gridConfig: {
				columns: [
					{
						id: 'RfistatusFk',
						model: 'RfistatusFk',
						type: FieldType.Quantity,
						label: { text: 'RfistatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RfistatusTargetFk',
						model: 'RfistatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'RfistatusTargetFk' },
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
