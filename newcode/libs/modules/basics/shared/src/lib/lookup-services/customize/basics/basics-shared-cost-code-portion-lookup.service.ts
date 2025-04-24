/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCostCodePortionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCostCodePortionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCostCodePortionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCostCodePortionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/costcodeportion/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '265e57f48db94c1eb16f321fef6527a2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCostCodePortionEntity) => x.DescriptionInfo),
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
