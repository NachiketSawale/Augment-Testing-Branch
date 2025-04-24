/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringDrawingStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringDrawingStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringDrawingStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringDrawingStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringdrawingstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '14e11546382743d3addba91149018657',
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
						id: 'DrawingStatusFk',
						model: 'DrawingStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DrawingStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DrawingStatusTargetFk',
						model: 'DrawingStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DrawingStatusTargetFk' },
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
					}
				]
			}
		});
	}
}
