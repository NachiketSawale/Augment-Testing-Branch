/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFormDataStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFormDataStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFormDataStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFormDataStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/formdatastatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6aad99e885a14ee7ab9b6eeb4818753f',
			valueMember: 'Id',
			displayMember: 'FormdataStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'FormdataStatusruleFk',
						model: 'FormdataStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'FormdataStatusruleFk' },
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
