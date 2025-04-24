/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstimateRoundingConfigurationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstimateRoundingConfigurationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstimateRoundingConfigurationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstimateRoundingConfigurationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estimateroundingconfigurationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f8aa88ad5fe140b18c8af4b52a834a0e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstimateRoundingConfigurationTypeEntity) => x.DescriptionInfo),
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
						id: 'EstimateRoundingConfigFk',
						model: 'EstimateRoundingConfigFk',
						type: FieldType.Quantity,
						label: { text: 'EstimateRoundingConfigFk' },
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
