/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingSheetStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingSheetStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingSheetStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingSheetStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingsheetstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '523e60d0c41944318f17ad404100b828',
			valueMember: 'Id',
			displayMember: 'SheetStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'SheetStatusRuleFk',
						model: 'SheetStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'SheetStatusRuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
