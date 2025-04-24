/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportRteStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportRteStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportRteStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportRteStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportrtestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '210e2d3f6671421b96bef102ecf47a7c',
			valueMember: 'Id',
			displayMember: 'RteStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'RteStatusruleFk',
						model: 'RteStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'RteStatusruleFk' },
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
