/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectGroupStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectGroupStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectGroupStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectGroupStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectgroupstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cb693c8c5fda4548868ad8e6301974a8',
			valueMember: 'Id',
			displayMember: 'GroupStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'GroupStatusFk',
						model: 'GroupStatusFk',
						type: FieldType.Quantity,
						label: { text: 'GroupStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GroupStatusTargetFk',
						model: 'GroupStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'GroupStatusTargetFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
