/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementDocumentStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementDocumentStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementDocumentStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementDocumentStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementdocumentstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f518ad77c0c040d8b1f5d82fd62a6dae',
			valueMember: 'Id',
			displayMember: 'DocumentStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'DocumentStatusRuleFk',
						model: 'DocumentStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentStatusRuleFk' },
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
