/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingReportStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingReportStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingReportStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingReportStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingreportstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fa7889ba747e4091a146841abcb6ebc2',
			valueMember: 'Id',
			displayMember: 'RepStatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'RepStatusruleFk',
						model: 'RepStatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'RepStatusruleFk' },
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
