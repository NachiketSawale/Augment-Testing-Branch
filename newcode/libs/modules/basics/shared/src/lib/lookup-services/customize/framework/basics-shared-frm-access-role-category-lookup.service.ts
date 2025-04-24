/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFrmAccessRoleCategoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFrmAccessRoleCategoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFrmAccessRoleCategoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFrmAccessRoleCategoryEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/frmaccessrolecategory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b2c207276cfb4bd7a97627fe9b3fe902',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Comment,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Name',
						model: 'Name',
						type: FieldType.Comment,
						label: { text: 'Name' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
