/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringDrawingComponentStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringdrawingcomponentstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8e30043e60a9480eb30547646fa841ec',
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
						id: 'DrwCompStatusFk',
						model: 'DrwCompStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DrwCompStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DrwCompStatusTargetFk',
						model: 'DrwCompStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DrwCompStatusTargetFk' },
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
						id: 'Hasrolevalidation',
						model: 'Hasrolevalidation',
						type: FieldType.Boolean,
						label: { text: 'Hasrolevalidation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
