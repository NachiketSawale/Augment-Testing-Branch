/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeChangeTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeChangeTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedChangeTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeChangeTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/changetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ee8181682e084ea69f44e658600b633f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeChangeTypeEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'IsChangeOrder',
						model: 'IsChangeOrder',
						type: FieldType.Boolean,
						label: { text: 'IsChangeOrder' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProcurement',
						model: 'IsProcurement',
						type: FieldType.Boolean,
						label: { text: 'IsProcurement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSales',
						model: 'IsSales',
						type: FieldType.Boolean,
						label: { text: 'IsSales' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProjectChange',
						model: 'IsProjectChange',
						type: FieldType.Boolean,
						label: { text: 'IsProjectChange' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
