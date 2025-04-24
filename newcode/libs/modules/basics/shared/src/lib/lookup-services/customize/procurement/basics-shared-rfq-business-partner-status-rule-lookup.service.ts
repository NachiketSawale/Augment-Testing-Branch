/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqBusinessPartnerStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfqbusinesspartnerstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7003e5db5a1b4ddb8f3205e17be9b10d',
			valueMember: 'Id',
			displayMember: 'BusinessPartnerStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'BusinessPartnerStatusFk',
						model: 'BusinessPartnerStatusFk',
						type: FieldType.Quantity,
						label: { text: 'BusinessPartnerStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BusinessPartnerStatusTargetFk',
						model: 'BusinessPartnerStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'BusinessPartnerStatusTargetFk' },
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
