/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '74747bb7335f45a19dd141dcd234c1c5',
			valueMember: 'Id',
			displayMember: 'EmployeeStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'EmployeeStatusFk',
						model: 'EmployeeStatusFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EmployeeStatusTargetFk',
						model: 'EmployeeStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeStatusTargetFk' },
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
