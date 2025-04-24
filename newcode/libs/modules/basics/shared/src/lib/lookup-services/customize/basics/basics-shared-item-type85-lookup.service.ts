/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeItemType85Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeItemType85Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedItemType85LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeItemType85Entity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/itemtype85/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7c158a8d89514515bc9e62dcb28cc301',
			valueMember: 'Id',
			displayMember: 'Code',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeItemType85Entity) => x.DescriptionInfo),
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
