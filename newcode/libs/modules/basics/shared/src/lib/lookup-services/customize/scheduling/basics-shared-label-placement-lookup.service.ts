/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLabelPlacementEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLabelPlacementEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLabelPlacementLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLabelPlacementEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/labelplacement/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '008f500de76a4119a44a3e360ed6374b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLabelPlacementEntity) => x.DescriptionInfo),
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
						id: 'ShortKeyInfo',
						model: 'ShortKeyInfo',
						type: FieldType.Translation,
						label: { text: 'ShortKeyInfo' },
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
