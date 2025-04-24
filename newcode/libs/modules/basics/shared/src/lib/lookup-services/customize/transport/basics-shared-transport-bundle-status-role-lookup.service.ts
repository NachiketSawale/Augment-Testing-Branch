/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportBundleStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportBundleStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportBundleStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportBundleStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportbundlestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f70ed564543f4cc1939d33c7a2456efc',
			valueMember: 'Id',
			displayMember: 'BundleStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'BundleStatusruleFk',
						model: 'BundleStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'BundleStatusruleFk' },
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
