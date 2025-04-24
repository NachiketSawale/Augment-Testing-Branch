/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeSymbolTrafficlightEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeSymbolTrafficlightEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeSymbolTrafficlightLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeSymbolTrafficlightEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timesymboltrafficlight/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '15920405af5a4a96b473f69925017190',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeSymbolTrafficlightEntity) => x.DescriptionInfo),
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
						id: 'Colour',
						model: 'Colour',
						type: FieldType.Quantity,
						label: { text: 'Colour' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
