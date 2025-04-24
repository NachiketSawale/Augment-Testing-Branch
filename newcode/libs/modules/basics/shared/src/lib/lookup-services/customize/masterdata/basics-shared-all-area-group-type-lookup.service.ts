/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAllAreaGroupTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAllAreaGroupTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAllAreaGroupTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAllAreaGroupTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/allareagrouptype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f5ce300aa9d749dcb8cb77da4d0e8852',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Comment,
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
