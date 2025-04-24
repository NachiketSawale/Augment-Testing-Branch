/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingSheetStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingSheetStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingSheetStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingSheetStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingsheetstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '97ea8fd6b40745129fb7f90d68f58ded',
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
