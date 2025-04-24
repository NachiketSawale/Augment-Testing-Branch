/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ed8113452dbc4523a73190c1d1271cee',
			valueMember: 'Id',
			displayMember: 'PlantstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'PlantstatusruleFk',
						model: 'PlantstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'PlantstatusruleFk' },
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
