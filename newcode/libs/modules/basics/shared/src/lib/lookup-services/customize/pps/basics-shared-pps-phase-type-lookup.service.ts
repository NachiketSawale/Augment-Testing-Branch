/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsPhaseTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsPhaseTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsPhaseTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsPhaseTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsphasetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e1a63214758d4cc0a443d587f4f1aa4e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsPhaseTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'DateShiftMode',
						model: 'DateShiftMode',
						type: FieldType.Quantity,
						label: { text: 'DateShiftMode' },
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
