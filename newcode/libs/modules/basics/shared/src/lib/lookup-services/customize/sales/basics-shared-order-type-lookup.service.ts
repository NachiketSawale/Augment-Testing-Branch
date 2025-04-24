/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ordertype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '286385c1d1c941aeb30a2e6c55ed8224',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeOrderTypeEntity) => x.DescriptionInfo),
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
						id: 'IsMain',
						model: 'IsMain',
						type: FieldType.Boolean,
						label: { text: 'IsMain' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsChange',
						model: 'IsChange',
						type: FieldType.Boolean,
						label: { text: 'IsChange' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSide',
						model: 'IsSide',
						type: FieldType.Boolean,
						label: { text: 'IsSide' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFrameworkCallOff',
						model: 'IsFrameworkCallOff',
						type: FieldType.Boolean,
						label: { text: 'IsFrameworkCallOff' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
