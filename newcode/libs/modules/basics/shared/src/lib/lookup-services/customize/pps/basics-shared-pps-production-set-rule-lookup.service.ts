/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionSetRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionSetRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionSetRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionSetRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionsetrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '822839bbe4f54b7f924431e354ec2d06',
			valueMember: 'Id',
			displayMember: 'ProductionSetStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductionSetStatusFk',
						model: 'ProductionSetStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ProductionSetStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ProductionSetStatusTargetFk',
						model: 'ProductionSetStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ProductionSetStatusTargetFk' },
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
