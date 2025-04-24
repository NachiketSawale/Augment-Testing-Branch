/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/materialstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '583a604b3bda407e8ad065ca38dd6a9a',
			valueMember: 'Id',
			displayMember: 'MaterialStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'MaterialStatusFk',
						model: 'MaterialStatusFk',
						type: FieldType.Quantity,
						label: { text: 'MaterialStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaterialStatusTargetFk',
						model: 'MaterialStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'MaterialStatusTargetFk' },
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
