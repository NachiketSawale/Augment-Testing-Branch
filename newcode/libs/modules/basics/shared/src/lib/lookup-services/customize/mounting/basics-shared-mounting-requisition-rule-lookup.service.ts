/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingRequisitionRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingRequisitionRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingRequisitionRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingRequisitionRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingrequisitionrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c1e7ba911b344eff9e83e20e81cb2e81',
			valueMember: 'Id',
			displayMember: 'AccessrightDescriptorFk',
			gridConfig: {
				columns: [
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
						id: 'ReqStatusFk',
						model: 'ReqStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReqStatusTargetFk',
						model: 'ReqStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusTargetFk' },
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
