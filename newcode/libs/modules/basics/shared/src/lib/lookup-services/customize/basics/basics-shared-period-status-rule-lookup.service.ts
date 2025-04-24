/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePeriodStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePeriodStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPeriodStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePeriodStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/periodstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '08344c34e0aa4a42a768bbb3c6f37283',
			valueMember: 'Id',
			displayMember: 'PeriodStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PeriodStatusFk',
						model: 'PeriodStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PeriodStatusTargetFk',
						model: 'PeriodStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusTargetFk' },
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
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
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
