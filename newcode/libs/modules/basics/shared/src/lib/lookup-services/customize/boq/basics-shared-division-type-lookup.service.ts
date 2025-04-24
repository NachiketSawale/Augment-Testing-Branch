/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDivisionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDivisionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDivisionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDivisionTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/divisiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c08a38b0cd0d4b58b34fcaeecf10d9b5',
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
					}
				]
			}
		});
	}
}
