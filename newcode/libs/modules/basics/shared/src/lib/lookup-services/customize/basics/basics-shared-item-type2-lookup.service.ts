/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeItemType2Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeItemType2Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedItemType2LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeItemType2Entity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/itemtype2/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6af33c6059a04a86b330ce3b55ed528a',
			valueMember: 'Id',
			displayMember: 'Code',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeItemType2Entity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Translation,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
