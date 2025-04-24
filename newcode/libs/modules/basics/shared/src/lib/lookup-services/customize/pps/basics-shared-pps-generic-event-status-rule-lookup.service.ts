/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsGenericEventStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsGenericEventStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsGenericEventStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsGenericEventStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsgenericeventstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '57102c1452e843ff8be277c24c97333b',
			valueMember: 'Id',
			displayMember: 'AccessrightDescriptorFk',
			gridConfig: {
				columns: [
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
						id: 'GenericEventStatusFk',
						model: 'GenericEventStatusFk',
						type: FieldType.Quantity,
						label: { text: 'GenericEventStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GenericEventStatusTargetFk',
						model: 'GenericEventStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'GenericEventStatusTargetFk' },
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
