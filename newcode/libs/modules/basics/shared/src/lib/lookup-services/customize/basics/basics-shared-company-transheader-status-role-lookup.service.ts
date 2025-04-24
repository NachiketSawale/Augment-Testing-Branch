/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCompanyTransheaderStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCompanyTransheaderStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCompanyTransheaderStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCompanyTransheaderStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/companytransheaderstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c9a3feb5545541c2b3ef819695f6d963',
			valueMember: 'Id',
			displayMember: 'CompanyTransheaderStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'CompanyTransheaderStatusRuleFk',
						model: 'CompanyTransheaderStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyTransheaderStatusRuleFk' },
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
