/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePeriodStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePeriodStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPeriodStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePeriodStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/periodstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8bda382f1e7942b7a9c1b642e792a12d',
			valueMember: 'Id',
			displayMember: 'PeriodStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'PeriodStatusruleFk',
						model: 'PeriodStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'PeriodStatusruleFk' },
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
