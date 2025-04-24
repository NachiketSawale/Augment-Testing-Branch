/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantWarrantyStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantWarrantyStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantWarrantyStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantWarrantyStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantwarrantystatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5826f838a1294d108f94e1408d05f4f9',
			valueMember: 'Id',
			displayMember: 'WarrantyStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'WarrantyStatusRuleFk',
						model: 'WarrantyStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'WarrantyStatusRuleFk' },
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
