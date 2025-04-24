/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCosInstHeaderStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCosInstHeaderStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCosInstHeaderStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCosInstHeaderStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/cosinstheaderstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6a3a2f16ecd1478e8311789cb1875e96',
			valueMember: 'Id',
			displayMember: 'InsheadstateFk',
			gridConfig: {
				columns: [
					{
						id: 'InsheadstateFk',
						model: 'InsheadstateFk',
						type: FieldType.Quantity,
						label: { text: 'InsheadstateFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InsheadstateTargetFk',
						model: 'InsheadstateTargetFk',
						type: FieldType.Quantity,
						label: { text: 'InsheadstateTargetFk' },
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
