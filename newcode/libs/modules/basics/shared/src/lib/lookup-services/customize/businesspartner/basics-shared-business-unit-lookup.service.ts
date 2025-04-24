/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBusinessUnitEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBusinessUnitEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBusinessUnitLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBusinessUnitEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/businessunit/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b1d6a069fc7c4076af24dd868e33db34',
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
