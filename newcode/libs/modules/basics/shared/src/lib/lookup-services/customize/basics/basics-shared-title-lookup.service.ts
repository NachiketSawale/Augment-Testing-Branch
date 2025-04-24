/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTitleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTitleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTitleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTitleEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/title/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c33be56f02ca4b4aa55889828e7d72b5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTitleEntity) => x.DescriptionInfo),
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
						id: 'SalutationInfo',
						model: 'SalutationInfo',
						type: FieldType.Translation,
						label: { text: 'SalutationInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AddressTitleInfo',
						model: 'AddressTitleInfo',
						type: FieldType.Translation,
						label: { text: 'AddressTitleInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
