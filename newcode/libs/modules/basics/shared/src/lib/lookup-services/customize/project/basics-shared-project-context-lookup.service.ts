/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectContextEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectcontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '69e94a07700e4887b28cddb2f00e81ad',
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
