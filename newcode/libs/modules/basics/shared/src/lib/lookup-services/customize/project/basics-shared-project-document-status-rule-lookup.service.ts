/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDocumentStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDocumentStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDocumentStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDocumentStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectdocumentstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a5dd54f85b45488e8f282d12d8501324',
			valueMember: 'Id',
			displayMember: 'DocumentstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'DocumentstatusFk',
						model: 'DocumentstatusFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DocumentstatusTargetFk',
						model: 'DocumentstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentstatusTargetFk' },
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
