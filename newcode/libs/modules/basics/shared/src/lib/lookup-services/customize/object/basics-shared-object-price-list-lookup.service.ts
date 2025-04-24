/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectPriceListEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectPriceListEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectPriceListLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectPriceListEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/objectpricelist/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2af3685d28774c3fa32c87ae187335d0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeObjectPriceListEntity) => x.DescriptionInfo),
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
