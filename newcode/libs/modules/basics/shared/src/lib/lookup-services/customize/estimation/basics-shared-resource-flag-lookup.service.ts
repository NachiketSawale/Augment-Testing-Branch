/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourceFlagEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourceFlagEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourceFlagLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourceFlagEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resourceflag/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '039d7e2ee67e4fda9ddee8159d948c82',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResourceFlagEntity) => x.DescriptionInfo),
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Typicalcode',
						model: 'Typicalcode',
						type: FieldType.Quantity,
						label: { text: 'Typicalcode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsExcludePrcboqPrice',
						model: 'IsExcludePrcboqPrice',
						type: FieldType.Boolean,
						label: { text: 'IsExcludePrcboqPrice' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
