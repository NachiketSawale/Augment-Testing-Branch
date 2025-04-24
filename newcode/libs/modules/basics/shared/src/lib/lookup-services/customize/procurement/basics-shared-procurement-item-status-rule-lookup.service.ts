/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementItemStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementItemStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementItemStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementItemStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementitemstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4af4a6ec525f420ca7560c3e1edd4e80',
			valueMember: 'Id',
			displayMember: 'ItemstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ItemstatusFk',
						model: 'ItemstatusFk',
						type: FieldType.Quantity,
						label: { text: 'ItemstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ItemstatusTargetFk',
						model: 'ItemstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ItemstatusTargetFk' },
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
