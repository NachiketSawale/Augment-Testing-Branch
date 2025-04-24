/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '10aaad21a3344d99a9b5700571142c06',
			valueMember: 'Id',
			displayMember: 'ProductStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductStatusruleFk',
						model: 'ProductStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ProductStatusruleFk' },
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
