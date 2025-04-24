/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeHsqeChecklistStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeHsqeChecklistStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedHsqeChecklistStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeHsqeChecklistStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/hsqecheckliststatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c89cadeacedd40ff94eb2cc387b73f24',
			valueMember: 'Id',
			displayMember: 'ChlStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ChlStatusFk',
						model: 'ChlStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ChlStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ChlStatusTargetFk',
						model: 'ChlStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ChlStatusTargetFk' },
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
