/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentPriceListEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentPriceListEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentPriceListLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentPriceListEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/equipmentpricelist/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd649289d71274fbeac20522c1efe9e69',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEquipmentPriceListEntity) => x.DescriptionInfo),
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
						id: 'EtmContextFk',
						model: 'EtmContextFk',
						type: FieldType.Quantity,
						label: { text: 'EtmContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricelistTypeFk',
						model: 'PricelistTypeFk',
						type: FieldType.Quantity,
						label: { text: 'PricelistTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CurrencyFk',
						model: 'CurrencyFk',
						type: FieldType.Quantity,
						label: { text: 'CurrencyFk' },
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
						id: 'IsManualEditPlantMaster',
						model: 'IsManualEditPlantMaster',
						type: FieldType.Boolean,
						label: { text: 'IsManualEditPlantMaster' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsManualEditJob',
						model: 'IsManualEditJob',
						type: FieldType.Boolean,
						label: { text: 'IsManualEditJob' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsManualEditDispatching',
						model: 'IsManualEditDispatching',
						type: FieldType.Boolean,
						label: { text: 'IsManualEditDispatching' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion1Name',
						model: 'PricePortion1Name',
						type: FieldType.Description,
						label: { text: 'PricePortion1Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion2Name',
						model: 'PricePortion2Name',
						type: FieldType.Description,
						label: { text: 'PricePortion2Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion3Name',
						model: 'PricePortion3Name',
						type: FieldType.Description,
						label: { text: 'PricePortion3Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion4Name',
						model: 'PricePortion4Name',
						type: FieldType.Description,
						label: { text: 'PricePortion4Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion5Name',
						model: 'PricePortion5Name',
						type: FieldType.Description,
						label: { text: 'PricePortion5Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricePortion6Name',
						model: 'PricePortion6Name',
						type: FieldType.Description,
						label: { text: 'PricePortion6Name' },
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
						id: 'ValidFrom',
						model: 'ValidFrom',
						type: FieldType.DateUtc,
						label: { text: 'ValidFrom' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValidTo',
						model: 'ValidTo',
						type: FieldType.DateUtc,
						label: { text: 'ValidTo' },
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
						id: 'ReferenceYear',
						model: 'ReferenceYear',
						type: FieldType.Quantity,
						label: { text: 'ReferenceYear' },
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
						id: 'CatalogFk',
						model: 'CatalogFk',
						type: FieldType.Quantity,
						label: { text: 'CatalogFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
