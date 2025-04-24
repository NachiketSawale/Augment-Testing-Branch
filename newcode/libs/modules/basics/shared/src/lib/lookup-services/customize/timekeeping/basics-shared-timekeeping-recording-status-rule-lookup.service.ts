/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingRecordingStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingRecordingStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingRecordingStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingRecordingStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingrecordingstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'feed20e13a794eb69a698e80b9359a98',
			valueMember: 'Id',
			displayMember: 'RecordingStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'RecordingStatusFk',
						model: 'RecordingStatusFk',
						type: FieldType.Quantity,
						label: { text: 'RecordingStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RecordingStatusTargetFk',
						model: 'RecordingStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'RecordingStatusTargetFk' },
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
