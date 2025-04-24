/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSelfbillingStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSelfbillingStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSelfbillingStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSelfbillingStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/selfbillingstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '610594a322fd4e9cad32af582bc32c05',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isbilled',
						model: 'Isbilled',
						type: FieldType.Boolean,
						label: { text: 'Isbilled' },
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
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
