/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectInterestEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectInterestEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectInterestLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectInterestEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/objectinterest/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0ce0a560cb8f434f8eea675d12f7068b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeObjectInterestEntity) => x.DescriptionInfo),
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
