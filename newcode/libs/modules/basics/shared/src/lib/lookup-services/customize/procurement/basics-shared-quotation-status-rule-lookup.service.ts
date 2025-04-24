/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQuotationStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQuotationStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQuotationStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQuotationStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/quotationstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fc15e3bf450f4a9b959da9f98783ba10',
			valueMember: 'Id',
			displayMember: 'StatusFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusFk',
						model: 'StatusFk',
						type: FieldType.Quantity,
						label: { text: 'StatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StatusTargetFk',
						model: 'StatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'StatusTargetFk' },
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
