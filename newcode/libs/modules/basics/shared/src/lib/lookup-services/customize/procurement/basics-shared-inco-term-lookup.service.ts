/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeIncoTermEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeIncoTermEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedIncoTermLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeIncoTermEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/incoterm/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a2c87a66024e435abdcaebad807e5e19',
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
