/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSiteTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSiteTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSiteTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSiteTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/sitetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '04370604522a4a4bb4eb4e05fda814fa',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSiteTypeEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFactory',
						model: 'IsFactory',
						type: FieldType.Boolean,
						label: { text: 'IsFactory' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStockYard',
						model: 'IsStockYard',
						type: FieldType.Boolean,
						label: { text: 'IsStockYard' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
