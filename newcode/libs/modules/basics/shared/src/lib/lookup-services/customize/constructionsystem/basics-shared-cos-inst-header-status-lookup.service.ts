/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCosInstHeaderStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCosInstHeaderStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCosInstHeaderStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCosInstHeaderStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/cosinstheaderstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f56f3f8e605f4a94825ed7f576f7b427',
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
