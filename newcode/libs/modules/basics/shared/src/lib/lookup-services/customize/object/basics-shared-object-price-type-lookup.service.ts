/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectPriceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectPriceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectPriceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectPriceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/objectpricetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '55c1ea58b79848aab46f87a23f34858d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeObjectPriceTypeEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'IncludeInTotal',
						model: 'IncludeInTotal',
						type: FieldType.Boolean,
						label: { text: 'IncludeInTotal' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
