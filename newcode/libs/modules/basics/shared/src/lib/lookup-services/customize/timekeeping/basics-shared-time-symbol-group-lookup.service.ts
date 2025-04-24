/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeSymbolGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeSymbolGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeSymbolGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeSymbolGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timesymbolgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '854503ba720d4f38a5e89887c854bd37',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeSymbolGroupEntity) => x.DescriptionInfo),
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
