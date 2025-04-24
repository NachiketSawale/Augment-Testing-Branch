/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ec53949279d741268c34858f7a4b5d20',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
						id: 'IsPublicOpen',
						model: 'IsPublicOpen',
						type: FieldType.Boolean,
						label: { text: 'IsPublicOpen' },
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
