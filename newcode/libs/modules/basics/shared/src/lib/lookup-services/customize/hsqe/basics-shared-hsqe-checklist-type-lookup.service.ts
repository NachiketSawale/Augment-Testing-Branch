/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeHsqeChecklistTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeHsqeChecklistTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedHsqeChecklistTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeHsqeChecklistTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/hsqechecklisttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1e40a374e03e4d66990bcdcbba4c82f3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeHsqeChecklistTypeEntity) => x.DescriptionInfo),
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
