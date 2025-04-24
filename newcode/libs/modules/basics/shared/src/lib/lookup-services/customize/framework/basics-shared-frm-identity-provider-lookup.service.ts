/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFrmIdentityProviderEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFrmIdentityProviderEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFrmIdentityProviderLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFrmIdentityProviderEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/frmidentityprovider/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '82ee0350634d4487a87ea1e9ea1d8f6b',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Quantity,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
