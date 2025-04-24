/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingPeriodStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingPeriodStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingPeriodStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingPeriodStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingperiodstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '45e0b0713cb94175b959df08fff84988',
			valueMember: 'Id',
			displayMember: 'PeriodStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PeriodStatusFk',
						model: 'PeriodStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PeriodStatusTargetFk',
						model: 'PeriodStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusTargetFk' },
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
