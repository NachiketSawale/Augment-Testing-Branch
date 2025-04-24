/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeConTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeConTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedConTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeConTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/contype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '62c78ac7811c4d8faa142d6fb000da9c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeConTypeEntity) => x.DescriptionInfo),
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
