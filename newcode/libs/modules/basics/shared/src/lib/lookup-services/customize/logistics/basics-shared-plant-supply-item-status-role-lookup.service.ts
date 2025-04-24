/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantSupplyItemStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantSupplyItemStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantSupplyItemStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantSupplyItemStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantsupplyitemstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9fcec4653e2e47d88b2b37fd05f6f3e2',
			valueMember: 'Id',
			displayMember: 'PlantSupItemStatRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'PlantSupItemStatRuleFk',
						model: 'PlantSupItemStatRuleFk',
						type: FieldType.Quantity,
						label: { text: 'PlantSupItemStatRuleFk' },
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
