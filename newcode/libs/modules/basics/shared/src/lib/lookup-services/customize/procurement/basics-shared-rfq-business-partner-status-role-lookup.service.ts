/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqBusinessPartnerStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfqbusinesspartnerstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3b17944a946140aebf4cc0abf5e3b14e',
			valueMember: 'Id',
			displayMember: 'BpStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'BpStatusRuleFk',
						model: 'BpStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'BpStatusRuleFk' },
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
