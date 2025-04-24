/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsClaimStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsClaimStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsClaimStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsClaimStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticsclaimstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '762208ae5cb04837b132504d6a9ef815',
			valueMember: 'Id',
			displayMember: 'ClaimStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ClaimStatusFk',
						model: 'ClaimStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ClaimStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClaimStatusTargetFk',
						model: 'ClaimStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ClaimStatusTargetFk' },
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
