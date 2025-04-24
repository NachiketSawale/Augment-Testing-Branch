/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeUserInterfaceLanguageEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeUserInterfaceLanguageEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedUserInterfaceLanguageLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeUserInterfaceLanguageEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/userinterfacelanguage/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2acd4344a6ec4d2196f2bc2927b7f22c',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Language',
						model: 'Language',
						type: FieldType.Quantity,
						label: { text: 'Language' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Culture',
						model: 'Culture',
						type: FieldType.Quantity,
						label: { text: 'Culture' },
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
