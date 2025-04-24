/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeSymbolPresentationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeSymbolPresentationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeSymbolPresentationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeSymbolPresentationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timesymbolpresentation/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a6e3946305034acba799ef1f93c6262f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeSymbolPresentationEntity) => x.DescriptionInfo),
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
