/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDocumentStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDocumentStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDocumentStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDocumentStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectdocumentstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8c727fc4df55446b8d44912bba1e7626',
			valueMember: 'Id',
			displayMember: 'DocumentstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'DocumentstatusruleFk',
						model: 'DocumentstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'DocumentstatusruleFk' },
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
