/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectProspectStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectProspectStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectProspectStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectProspectStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectprospectstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1b68e26724334b89ab6d9733c935c5cf',
			valueMember: 'Id',
			displayMember: 'ProspectstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ProspectstatusFk',
						model: 'ProspectstatusFk',
						type: FieldType.Quantity,
						label: { text: 'ProspectstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ProspectstatusTargetFk',
						model: 'ProspectstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ProspectstatusTargetFk' },
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
