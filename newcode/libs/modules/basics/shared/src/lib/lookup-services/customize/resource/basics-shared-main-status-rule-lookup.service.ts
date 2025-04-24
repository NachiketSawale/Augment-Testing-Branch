/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMainStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMainStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMainStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMainStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mainstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1b9735c34c6946f584bf9e14874427ad',
			valueMember: 'Id',
			displayMember: 'MaintstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'MaintstatusFk',
						model: 'MaintstatusFk',
						type: FieldType.Quantity,
						label: { text: 'MaintstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaintstatusTargetFk',
						model: 'MaintstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'MaintstatusTargetFk' },
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
