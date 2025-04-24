/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementItemStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementItemStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementItemStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementItemStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementitemstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '69d9cec11f844c349e036bd2085342b4',
			valueMember: 'Id',
			displayMember: 'ItemstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ItemstatusruleFk',
						model: 'ItemstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ItemstatusruleFk' },
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
