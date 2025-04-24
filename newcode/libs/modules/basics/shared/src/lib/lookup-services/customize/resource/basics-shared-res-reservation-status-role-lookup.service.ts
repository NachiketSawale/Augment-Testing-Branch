/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResReservationStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResReservationStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResReservationStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResReservationStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resreservationstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7318b9f36b754e4193800b920427d796',
			valueMember: 'Id',
			displayMember: 'ReservationstatruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ReservationstatruleFk',
						model: 'ReservationstatruleFk',
						type: FieldType.Quantity,
						label: { text: 'ReservationstatruleFk' },
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
