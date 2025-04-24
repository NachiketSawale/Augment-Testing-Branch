/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingReportStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingReportStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingReportStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingReportStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingreportstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ddbcf90a598e43f3b68bc00ef02eebbf',
			valueMember: 'Id',
			displayMember: 'ReportStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ReportStatusFk',
						model: 'ReportStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ReportStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReportStatusTargetFk',
						model: 'ReportStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ReportStatusTargetFk' },
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
