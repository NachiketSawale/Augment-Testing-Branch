/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionSetRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionSetRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionSetRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionSetRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionsetrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1a7115cea72c46f1beb0ac2eb1cc2bf6',
			valueMember: 'Id',
			displayMember: 'ProductionSetStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductionSetStatusRuleFk',
						model: 'ProductionSetStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'ProductionSetStatusRuleFk' },
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
