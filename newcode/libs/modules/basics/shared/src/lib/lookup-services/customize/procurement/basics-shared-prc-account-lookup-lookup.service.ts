/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcAccountLookupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcAccountLookupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcAccountLookupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcAccountLookupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prcaccountlookup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ee44dcdac79e46c8948b976873ce7583',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcAccountLookupEntity) => x.DescriptionInfo),
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
