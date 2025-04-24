/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsGenericEventStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsGenericEventStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsGenericEventStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsGenericEventStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsgenericeventstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2eaec10ee91a4b10b6b54e3c14505ca9',
			valueMember: 'Id',
			displayMember: 'GenericEventStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'GenericEventStatusRuleFk',
						model: 'GenericEventStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'GenericEventStatusRuleFk' },
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
