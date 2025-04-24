/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectUnitStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectUnitStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectUnitStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectUnitStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectunitstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '40dca4156d50477ba6f50f1e1089b572',
			valueMember: 'Id',
			displayMember: 'UnitstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'UnitstatusruleFk',
						model: 'UnitstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'UnitstatusruleFk' },
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
