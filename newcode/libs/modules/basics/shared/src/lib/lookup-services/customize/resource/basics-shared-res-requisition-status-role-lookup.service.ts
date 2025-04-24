/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resrequisitionstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b27aa8f9701f4bbd87fd00080c5ff286',
			valueMember: 'Id',
			displayMember: 'RequisitionstatruleFk',
			gridConfig: {
				columns: [
					{
						id: 'RequisitionstatruleFk',
						model: 'RequisitionstatruleFk',
						type: FieldType.Quantity,
						label: { text: 'RequisitionstatruleFk' },
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
