/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsHeaderTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsHeaderTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsHeaderTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsHeaderTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsheadertype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0968c0dc33b549bd8445124275877c01',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsHeaderTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsForScrap',
						model: 'IsForScrap',
						type: FieldType.Boolean,
						label: { text: 'IsForScrap' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag1',
						model: 'UserFlag1',
						type: FieldType.Boolean,
						label: { text: 'UserFlag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag2',
						model: 'UserFlag2',
						type: FieldType.Boolean,
						label: { text: 'UserFlag2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForStock',
						model: 'IsForStock',
						type: FieldType.Boolean,
						label: { text: 'IsForStock' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isforpreliminary',
						model: 'Isforpreliminary',
						type: FieldType.Boolean,
						label: { text: 'Isforpreliminary' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
