/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqRoundingConfigurationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqRoundingConfigurationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqRoundingConfigurationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqRoundingConfigurationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqroundingconfigurationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5cc1cbecfc764b01b9e5221a12f4b8f4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqRoundingConfigurationTypeEntity) => x.DescriptionInfo),
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
						id: 'BoqRoundingConfigFk',
						model: 'BoqRoundingConfigFk',
						type: FieldType.Quantity,
						label: { text: 'BoqRoundingConfigFk' },
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
						id: 'LineItemContextFk',
						model: 'LineItemContextFk',
						type: FieldType.Quantity,
						label: { text: 'LineItemContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEnterprise',
						model: 'IsEnterprise',
						type: FieldType.Boolean,
						label: { text: 'IsEnterprise' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
