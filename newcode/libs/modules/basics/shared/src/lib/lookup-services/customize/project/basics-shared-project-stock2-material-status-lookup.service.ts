/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStock2MaterialStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStock2MaterialStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStock2MaterialStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStock2MaterialStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectstock2materialstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '59508b4e8cc74fe1951f1027e39cc2fb',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Description,
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsApproved',
						model: 'IsApproved',
						type: FieldType.Boolean,
						label: { text: 'IsApproved' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDeclined',
						model: 'IsDeclined',
						type: FieldType.Boolean,
						label: { text: 'IsDeclined' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
