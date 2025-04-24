/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProcessTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProcessTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProcessTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProcessTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsprocesstype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b90e8356f6b74a35864ca4c9544dc725',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsProcessTypeEntity) => x.DescriptionInfo),
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
						id: 'IsPlaceHolder',
						model: 'IsPlaceHolder',
						type: FieldType.Boolean,
						label: { text: 'IsPlaceHolder' },
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
					}
				]
			}
		});
	}
}
