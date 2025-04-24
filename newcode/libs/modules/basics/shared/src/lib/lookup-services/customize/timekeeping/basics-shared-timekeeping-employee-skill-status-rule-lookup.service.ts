/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeSkillStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeeskillstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a2d7297741be493c8a059994e7600d0d',
			valueMember: 'Id',
			displayMember: 'EmployeeSkillStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'EmployeeSkillStatusFk',
						model: 'EmployeeSkillStatusFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeSkillStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EmployeeSkillStatusTargetFk',
						model: 'EmployeeSkillStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeSkillStatusTargetFk' },
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
