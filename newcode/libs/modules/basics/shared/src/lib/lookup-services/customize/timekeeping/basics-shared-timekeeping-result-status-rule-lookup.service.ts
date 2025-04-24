/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingResultStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingResultStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingResultStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingResultStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingresultstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '807ea88eea664eabb973e72b2673336c',
			valueMember: 'Id',
			displayMember: 'ResultStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ResultStatusFk',
						model: 'ResultStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ResultStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ResultStatusTargetFk',
						model: 'ResultStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ResultStatusTargetFk' },
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
