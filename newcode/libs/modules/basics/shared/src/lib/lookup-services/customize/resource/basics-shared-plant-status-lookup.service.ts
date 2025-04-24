/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8158d2b10ce546b4847d2e86bfa4e597',
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
						id: 'Isplannable',
						model: 'Isplannable',
						type: FieldType.Boolean,
						label: { text: 'Isplannable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isasset',
						model: 'Isasset',
						type: FieldType.Boolean,
						label: { text: 'Isasset' },
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
