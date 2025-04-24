/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCo2SourceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCo2SourceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCo2SourceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCo2SourceEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/co2source/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '07e1714ae9f14699be4288279d0f4656',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCo2SourceEntity) => x.DescriptionInfo),
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
