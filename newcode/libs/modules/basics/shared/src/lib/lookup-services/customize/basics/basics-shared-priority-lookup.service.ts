/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePriorityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePriorityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPriorityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePriorityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/priority/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0cd0e1f9f3a7435baa5be730f08fc0ba',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePriorityEntity) => x.DescriptionInfo),
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
						id: 'Priority',
						model: 'Priority',
						type: FieldType.Quantity,
						label: { text: 'Priority' },
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
