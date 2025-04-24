/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobCardStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobCardStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobCardStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobCardStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobcardstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7786891062854778bdedaebbfed3371d',
			valueMember: 'Id',
			displayMember: 'JobcardstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'JobcardstatusFk',
						model: 'JobcardstatusFk',
						type: FieldType.Quantity,
						label: { text: 'JobcardstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'JobcardstatusTargetFk',
						model: 'JobcardstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'JobcardstatusTargetFk' },
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
