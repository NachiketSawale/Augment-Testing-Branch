/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelObjectSetStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelObjectSetStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelObjectSetStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelObjectSetStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelobjectsetstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e4d83dda0453450e80549145f3bcc9ea',
			valueMember: 'Id',
			displayMember: 'ObjectsetstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ObjectsetstatusFk',
						model: 'ObjectsetstatusFk',
						type: FieldType.Quantity,
						label: { text: 'ObjectsetstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ObjectsetstatusTrgtFk',
						model: 'ObjectsetstatusTrgtFk',
						type: FieldType.Quantity,
						label: { text: 'ObjectsetstatusTrgtFk' },
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
