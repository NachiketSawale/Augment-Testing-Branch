/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsUpstreamItemStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsUpstreamItemStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsUpstreamItemStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsUpstreamItemStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsupstreamitemstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '829c4df8f5994b56a5a2604bc650a50c',
			valueMember: 'Id',
			displayMember: 'UpstreamItemStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'UpstreamItemStatusRuleFk',
						model: 'UpstreamItemStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'UpstreamItemStatusRuleFk' },
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
