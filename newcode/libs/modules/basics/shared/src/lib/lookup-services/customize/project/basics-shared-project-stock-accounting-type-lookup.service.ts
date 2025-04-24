/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStockAccountingTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStockAccountingTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStockAccountingTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStockAccountingTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectstockaccountingtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ad30d8b9990d46368933edfa55f09730',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectStockAccountingTypeEntity) => x.DescriptionInfo),
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
						id: 'Ispesaccrual',
						model: 'Ispesaccrual',
						type: FieldType.Boolean,
						label: { text: 'Ispesaccrual' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
