/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantWarrantyTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantWarrantyTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantWarrantyTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantWarrantyTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantwarrantytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '44d0e84fa6284a4b97b96b00242afd8b',
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
