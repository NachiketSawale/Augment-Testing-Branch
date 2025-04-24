/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingUnitStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingUnitStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingUnitStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingUnitStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/controllingunitstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1269f294573849309c01b89ab5d64f41',
			valueMember: 'Id',
			displayMember: 'ContrunitstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ContrunitstatusFk',
						model: 'ContrunitstatusFk',
						type: FieldType.Quantity,
						label: { text: 'ContrunitstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ContrunitstatusTargetFk',
						model: 'ContrunitstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ContrunitstatusTargetFk' },
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
