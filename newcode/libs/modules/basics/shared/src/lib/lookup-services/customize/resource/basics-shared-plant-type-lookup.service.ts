/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/planttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '492d344408024a16836a3a9ed9a45961',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePlantTypeEntity) => x.DescriptionInfo),
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
						id: 'PlantTypeFk',
						model: 'PlantTypeFk',
						type: FieldType.Quantity,
						label: { text: 'PlantTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBulk',
						model: 'IsBulk',
						type: FieldType.Boolean,
						label: { text: 'IsBulk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCluster',
						model: 'IsCluster',
						type: FieldType.Boolean,
						label: { text: 'IsCluster' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsClustered',
						model: 'IsClustered',
						type: FieldType.Boolean,
						label: { text: 'IsClustered' },
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
						id: 'HasSerial',
						model: 'HasSerial',
						type: FieldType.Boolean,
						label: { text: 'HasSerial' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsTimekeeping',
						model: 'IsTimekeeping',
						type: FieldType.Boolean,
						label: { text: 'IsTimekeeping' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsIgnoreWotByLocation',
						model: 'IsIgnoreWotByLocation',
						type: FieldType.Boolean,
						label: { text: 'IsIgnoreWotByLocation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsLogisticDataRequired',
						model: 'IsLogisticDataRequired',
						type: FieldType.Boolean,
						label: { text: 'IsLogisticDataRequired' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEstimatePlant',
						model: 'IsEstimatePlant',
						type: FieldType.Boolean,
						label: { text: 'IsEstimatePlant' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
