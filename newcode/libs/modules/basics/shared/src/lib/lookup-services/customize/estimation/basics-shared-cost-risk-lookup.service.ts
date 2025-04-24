/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCostRiskEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCostRiskEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCostRiskLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCostRiskEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/costrisk/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ff458527ab41471d863a90dcc5ca8161',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCostRiskEntity) => x.DescriptionInfo),
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
