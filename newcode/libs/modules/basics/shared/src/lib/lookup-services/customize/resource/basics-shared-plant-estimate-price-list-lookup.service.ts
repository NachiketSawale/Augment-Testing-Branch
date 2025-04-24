/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantEstimatePriceListEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantEstimatePriceListEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantEstimatePriceListLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantEstimatePriceListEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/plantestimatepricelist/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '684ed49d78e44a14bc8f826a1a9620f8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePlantEstimatePriceListEntity) => x.DescriptionInfo),
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
						id: 'LineItemContextFk',
						model: 'LineItemContextFk',
						type: FieldType.Quantity,
						label: { text: 'LineItemContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MasterDataContextFk',
						model: 'MasterDataContextFk',
						type: FieldType.Quantity,
						label: { text: 'MasterDataContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlantDivisionFk',
						model: 'PlantDivisionFk',
						type: FieldType.Quantity,
						label: { text: 'PlantDivisionFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Percent',
						model: 'Percent',
						type: FieldType.Quantity,
						label: { text: 'Percent' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CalculationTypeFk',
						model: 'CalculationTypeFk',
						type: FieldType.Quantity,
						label: { text: 'CalculationTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CatalogFk',
						model: 'CatalogFk',
						type: FieldType.Quantity,
						label: { text: 'CatalogFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
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
						id: 'ReferenceYear',
						model: 'ReferenceYear',
						type: FieldType.Quantity,
						label: { text: 'ReferenceYear' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricelisttypeFk',
						model: 'PricelisttypeFk',
						type: FieldType.Quantity,
						label: { text: 'PricelisttypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
