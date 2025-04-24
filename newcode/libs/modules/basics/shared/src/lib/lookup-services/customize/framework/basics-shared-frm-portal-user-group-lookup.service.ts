/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFrmPortalUserGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFrmPortalUserGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFrmPortalUserGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFrmPortalUserGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/frmportalusergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0aff01d3ea3641aea4e3b32f94009670',
			valueMember: 'Id',
			displayMember: 'Name',
			gridConfig: {
				columns: [
					{
						id: 'Name',
						model: 'Name',
						type: FieldType.Quantity,
						label: { text: 'Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessgroupFk',
						model: 'AccessgroupFk',
						type: FieldType.Quantity,
						label: { text: 'AccessgroupFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
