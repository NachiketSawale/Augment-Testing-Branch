/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTranslationSourceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTranslationSourceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTranslationSourceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTranslationSourceTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/translationsourcetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '69a192c59cba4dc8bef5e1315e0cce56',
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
