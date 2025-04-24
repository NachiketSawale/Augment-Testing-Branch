/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePriceListEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePriceListEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPriceListLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePriceListEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/pricelist/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b9d079cb5607411c9c97ecd2725a31bb',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePriceListEntity) => x.DescriptionInfo),
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
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
						id: 'CurrencyFk',
						model: 'CurrencyFk',
						type: FieldType.Quantity,
						label: { text: 'CurrencyFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
