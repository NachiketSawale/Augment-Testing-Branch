/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectRegionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectRegionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectRegionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectRegionEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectregion/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '95e6c0860d4d4365bd9ce8b48b063ba7',
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
