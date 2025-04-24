/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectUnitStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectUnitStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectUnitStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectUnitStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectunitstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2a6114e8f596401babf473a213c0f390',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
