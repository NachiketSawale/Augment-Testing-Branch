/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/eststatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f74128d9ed6845a290a783fa184cf68b',
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isactive',
						model: 'Isactive',
						type: FieldType.Boolean,
						label: { text: 'Isactive' },
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
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
