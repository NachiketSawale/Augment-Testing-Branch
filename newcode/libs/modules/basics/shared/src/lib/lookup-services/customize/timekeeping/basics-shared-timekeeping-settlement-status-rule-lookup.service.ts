/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingSettlementStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingSettlementStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingSettlementStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingSettlementStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingsettlementstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8f9e640dfed84bb9869f5092c75b01eb',
			valueMember: 'Id',
			displayMember: 'SettlementStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SettlementStatusFk',
						model: 'SettlementStatusFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SettlementStatusTargetFk',
						model: 'SettlementStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementStatusTargetFk' },
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
