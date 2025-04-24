/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeUserLabelEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeUserLabelEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedUserLabelLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeUserLabelEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/userlabel/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5b717fc2894f46c0a109a8b87b3a4a20',
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
						id: 'KeyWords',
						model: 'KeyWords',
						type: FieldType.Description,
						label: { text: 'KeyWords' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
