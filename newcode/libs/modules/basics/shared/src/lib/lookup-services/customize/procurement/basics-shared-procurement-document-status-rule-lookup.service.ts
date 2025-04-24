/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementDocumentStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementDocumentStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementDocumentStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementDocumentStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementdocumentstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aa0837c3c0e444a19cc95b9879254ca0',
			valueMember: 'Id',
			displayMember: 'DocumentStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'DocumentStatusFk',
						model: 'DocumentStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentStatusFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DocumentStatusTargetFk',
						model: 'DocumentStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentStatusTargetFk' },
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
