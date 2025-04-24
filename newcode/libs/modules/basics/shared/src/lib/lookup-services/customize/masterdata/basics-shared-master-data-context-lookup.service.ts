/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMasterDataContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMasterDataContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMasterDataContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMasterDataContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/masterdatacontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ba1d0aab56fc4756bb2045829b35bdeb',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMasterDataContextEntity) => x.DescriptionInfo),
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
						id: 'CurrencyFk',
						model: 'CurrencyFk',
						type: FieldType.Quantity,
						label: { text: 'CurrencyFk' },
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
