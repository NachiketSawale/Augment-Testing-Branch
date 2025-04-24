/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingRequisitionStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingRequisitionStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingRequisitionStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingRequisitionStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingrequisitionstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '593184309d534f718422474e99c5f21b',
			valueMember: 'Id',
			displayMember: 'ReqStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ReqStatusruleFk',
						model: 'ReqStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusruleFk' },
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
