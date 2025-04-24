/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoSheetStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoSheetStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoSheetStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoSheetStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtosheetstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e776091f28694ab9a8112e7af58aafe3',
			valueMember: 'Id',
			displayMember: 'SheetStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SheetStatusFk',
						model: 'SheetStatusFk',
						type: FieldType.Quantity,
						label: { text: 'SheetStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SheetStatusTargetFk',
						model: 'SheetStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SheetStatusTargetFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
