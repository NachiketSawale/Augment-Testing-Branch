/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectProspectStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectProspectStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectProspectStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectProspectStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectprospectstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f877651922964d918b80f56e226df734',
			valueMember: 'Id',
			displayMember: 'ProspectstatusruleFk',
			gridConfig: {
				columns: [
					{
						id: 'ProspectstatusruleFk',
						model: 'ProspectstatusruleFk',
						type: FieldType.Quantity,
						label: { text: 'ProspectstatusruleFk' },
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
