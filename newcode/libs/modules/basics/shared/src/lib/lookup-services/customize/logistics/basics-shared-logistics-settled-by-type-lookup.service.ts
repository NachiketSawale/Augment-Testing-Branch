/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettledByTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettledByTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettledByTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettledByTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticssettledbytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '80ee8b261c2c45dba60fde340a87fe2c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsSettledByTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
