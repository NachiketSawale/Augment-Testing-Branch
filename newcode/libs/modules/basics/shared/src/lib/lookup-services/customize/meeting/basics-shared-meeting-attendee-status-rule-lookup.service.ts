/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMeetingAttendeeStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMeetingAttendeeStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMeetingAttendeeStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMeetingAttendeeStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/meetingattendeestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ec0ce3ba0828423294a3f52e59b999f3',
			valueMember: 'Id',
			displayMember: 'AttendeeStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'AttendeeStatusFk',
						model: 'AttendeeStatusFk',
						type: FieldType.Quantity,
						label: { text: 'AttendeeStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AttendeeStatusTargetFk',
						model: 'AttendeeStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'AttendeeStatusTargetFk' },
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
