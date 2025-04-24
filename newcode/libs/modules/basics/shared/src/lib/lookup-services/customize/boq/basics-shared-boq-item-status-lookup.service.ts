/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqItemStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqItemStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqItemStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqItemStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqitemstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '96b11dca4f9149a984ed5f34e37358f6',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqItemStatusEntity) => x.DescriptionInfo),
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
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
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
