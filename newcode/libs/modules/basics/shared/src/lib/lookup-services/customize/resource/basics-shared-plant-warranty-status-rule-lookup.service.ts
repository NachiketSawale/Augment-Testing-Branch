/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantWarrantyStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantWarrantyStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantWarrantyStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantWarrantyStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantwarrantystatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '618a558ca1d04d32af296b30df6f62d5',
			valueMember: 'Id',
			displayMember: 'WarrantyStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'WarrantyStatusFk',
						model: 'WarrantyStatusFk',
						type: FieldType.Quantity,
						label: { text: 'WarrantyStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WarrantyStatusTargetFk',
						model: 'WarrantyStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'WarrantyStatusTargetFk' },
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
