/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSubsidiaryStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSubsidiaryStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSubsidiaryStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSubsidiaryStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/subsidiarystatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9b4a3beff69c4a2fb07c6f556e870b68',
			valueMember: 'Id',
			displayMember: 'SubsidiaryStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SubsidiaryStatusFk',
						model: 'SubsidiaryStatusFk',
						type: FieldType.Quantity,
						label: { text: 'SubsidiaryStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SubsidiaryStatusTargetFk',
						model: 'SubsidiaryStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SubsidiaryStatusTargetFk' },
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
