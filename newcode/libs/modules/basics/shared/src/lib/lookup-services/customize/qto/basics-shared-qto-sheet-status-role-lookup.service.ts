/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoSheetStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoSheetStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoSheetStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoSheetStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtosheetstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '41205760b4d44429ab1f960611c5dacf',
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
