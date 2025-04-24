/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/activitystatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8f37cf47f7a3418c89b2d64996db0ce5',
			valueMember: 'Id',
			displayMember: 'ActivitystateFk',
			gridConfig: {
				columns: [
					{
						id: 'ActivitystateFk',
						model: 'ActivitystateFk',
						type: FieldType.Quantity,
						label: { text: 'ActivitystateFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ActivitystateTargetFk',
						model: 'ActivitystateTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ActivitystateTargetFk' },
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
