/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringDrawingComponentStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringdrawingcomponentstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'db3eb53f94fd48379711c778de678546',
			valueMember: 'Id',
			displayMember: 'CompStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'CompStatusruleFk',
						model: 'CompStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'CompStatusruleFk' },
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
