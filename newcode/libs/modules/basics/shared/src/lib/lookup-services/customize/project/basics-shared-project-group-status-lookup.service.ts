/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectGroupStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectGroupStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectGroupStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectGroupStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectgroupstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ab8cfd9be19a459daefc12da752a3144',
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
