/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRubricCategoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRubricCategoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRubricCategoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRubricCategoryEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rubriccategory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '55b4cb9d6d604ee0b6830f335620e9f5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRubricCategoryEntity) => x.DescriptionInfo),
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
						id: 'RubricFk',
						model: 'RubricFk',
						type: FieldType.Quantity,
						label: { text: 'RubricFk' },
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
						id: 'DescriptionShortInfo',
						model: 'DescriptionShortInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionShortInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsHiddenInPublicApi',
						model: 'IsHiddenInPublicApi',
						type: FieldType.Boolean,
						label: { text: 'IsHiddenInPublicApi' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
