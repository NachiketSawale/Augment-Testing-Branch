/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTotalKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTotalKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTotalKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTotalKindEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/totalkind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e9800c2b261e42e6a7f6d0597e722d61',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTotalKindEntity) => x.DescriptionInfo),
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
