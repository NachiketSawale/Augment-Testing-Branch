/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSalesTaxMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSalesTaxMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSalesTaxMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSalesTaxMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/salestaxmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '22cb442fee704bf1941955b5bce90cc4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSalesTaxMethodEntity) => x.DescriptionInfo),
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
