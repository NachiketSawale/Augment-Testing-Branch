/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlannedAbsenceStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlannedAbsenceStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlannedAbsenceStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlannedAbsenceStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plannedabsencestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c94314bf900c424b861f4ade9cc1cef4',
			valueMember: 'Id',
			displayMember: 'PlannedAbsenceStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PlannedAbsenceStatusFk',
						model: 'PlannedAbsenceStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PlannedAbsenceStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlannedAbsenceStatusTargetFk',
						model: 'PlannedAbsenceStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PlannedAbsenceStatusTargetFk' },
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
