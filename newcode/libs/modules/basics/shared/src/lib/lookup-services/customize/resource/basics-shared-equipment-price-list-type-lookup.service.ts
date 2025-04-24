/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentPriceListTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentPriceListTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentPriceListTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentPriceListTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/equipmentpricelisttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c927a7dea205413d829725e9a4b712e1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEquipmentPriceListTypeEntity) => x.DescriptionInfo),
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
						id: 'CatalogFk',
						model: 'CatalogFk',
						type: FieldType.Quantity,
						label: { text: 'CatalogFk' },
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
