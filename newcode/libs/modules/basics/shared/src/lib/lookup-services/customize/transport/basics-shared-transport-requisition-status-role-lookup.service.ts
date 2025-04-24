/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportRequisitionStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportRequisitionStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportRequisitionStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportRequisitionStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportrequisitionstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3b9689c0165842188c3d50b2218fb7c3',
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
