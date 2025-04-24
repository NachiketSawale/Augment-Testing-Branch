/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCurrencyRateTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCurrencyRateTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCurrencyRateTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCurrencyRateTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/currencyratetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ab1da8508023495da19500a11a053def',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCurrencyRateTypeEntity) => x.DescriptionInfo),
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
