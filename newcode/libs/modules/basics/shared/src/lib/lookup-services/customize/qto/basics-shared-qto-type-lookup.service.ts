/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/qtotype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5a667dcea3da4045be8bb3dd7d3c0c8f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeQtoTypeEntity) => x.DescriptionInfo),
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
						id: 'GoniometerTypeFk',
						model: 'GoniometerTypeFk',
						type: FieldType.Quantity,
						label: { text: 'GoniometerTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
