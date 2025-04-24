/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourceTrafficLightEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourceTrafficLightEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourceTrafficLightLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourceTrafficLightEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resourcestrafficlight/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e81eff469bca41389bbc415eeb4c64a4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResourceTrafficLightEntity) => x.DescriptionInfo),
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
