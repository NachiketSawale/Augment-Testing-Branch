/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectUnitStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectUnitStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectUnitStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectUnitStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectunitstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'dca316a311444554b96bfec07b1ffd0f',
			valueMember: 'Id',
			displayMember: 'UnitstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'UnitstatusFk',
						model: 'UnitstatusFk',
						type: FieldType.Quantity,
						label: { text: 'UnitstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UnitstatusTargetFk',
						model: 'UnitstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'UnitstatusTargetFk' },
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
