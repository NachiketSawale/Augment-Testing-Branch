/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCustomerStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCustomerStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCustomerStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCustomerStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/customerstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd876529183134c6da81c8f6dfc24406f',
			valueMember: 'Id',
			displayMember: 'CustomerstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'CustomerstatusFk',
						model: 'CustomerstatusFk',
						type: FieldType.Quantity,
						label: { text: 'CustomerstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CustomerstatusTargetFk',
						model: 'CustomerstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'CustomerstatusTargetFk' },
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
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
