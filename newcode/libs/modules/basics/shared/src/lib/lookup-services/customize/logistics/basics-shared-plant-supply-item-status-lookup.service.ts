/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantSupplyItemStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantSupplyItemStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantSupplyItemStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantSupplyItemStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantsupplyitemstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5e0d0668694a4b28a02c372041454fce',
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
						id: 'IsSettled',
						model: 'IsSettled',
						type: FieldType.Boolean,
						label: { text: 'IsSettled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadyForSettlement',
						model: 'IsReadyForSettlement',
						type: FieldType.Boolean,
						label: { text: 'IsReadyForSettlement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
