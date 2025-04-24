/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/schedulestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bd39f94ef2f640e8acdbc452ce42499c',
			valueMember: 'Id',
			displayMember: 'SchedulestatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SchedulestatusFk',
						model: 'SchedulestatusFk',
						type: FieldType.Quantity,
						label: { text: 'SchedulestatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SchedulestatusTargetFk',
						model: 'SchedulestatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SchedulestatusTargetFk' },
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
