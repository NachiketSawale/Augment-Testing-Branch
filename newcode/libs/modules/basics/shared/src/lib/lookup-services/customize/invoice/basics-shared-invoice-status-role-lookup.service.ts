/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/invoicestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2aa1653c0abd4d9e8a3a780050378ddd',
			valueMember: 'Id',
			displayMember: 'StatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusruleFk',
						model: 'StatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'StatusruleFk' },
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
