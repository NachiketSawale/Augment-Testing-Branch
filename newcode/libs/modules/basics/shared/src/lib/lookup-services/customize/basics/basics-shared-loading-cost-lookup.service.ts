/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLoadingCostEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLoadingCostEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLoadingCostLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLoadingCostEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/loadingcost/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5f55c7cd408445eba2bef5a6a99483e8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLoadingCostEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
					},
					{
						id: 'IsFullLoadingCosts',
						model: 'IsFullLoadingCosts',
						type: FieldType.Boolean,
						label: { text: 'IsFullLoadingCosts' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReducedLoadingCosts',
						model: 'IsReducedLoadingCosts',
						type: FieldType.Boolean,
						label: { text: 'IsReducedLoadingCosts' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFullLoadingCostsVolume',
						model: 'IsFullLoadingCostsVolume',
						type: FieldType.Boolean,
						label: { text: 'IsFullLoadingCostsVolume' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReducedLoadingCostsVolume',
						model: 'IsReducedLoadingCostsVolume',
						type: FieldType.Boolean,
						label: { text: 'IsReducedLoadingCostsVolume' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForPlant',
						model: 'IsForPlant',
						type: FieldType.Boolean,
						label: { text: 'IsForPlant' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForMaterial',
						model: 'IsForMaterial',
						type: FieldType.Boolean,
						label: { text: 'IsForMaterial' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPercentMaterialTotal',
						model: 'IsPercentMaterialTotal',
						type: FieldType.Boolean,
						label: { text: 'IsPercentMaterialTotal' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
