/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialPortionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialPortionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialPortionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialPortionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/materialportiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd2bca88bdba74dad89be671370a5e7c5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMaterialPortionTypeEntity) => x.DescriptionInfo),
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
						id: 'CostCodeFk',
						model: 'CostCodeFk',
						type: FieldType.Quantity,
						label: { text: 'CostCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PriceConditionFk',
						model: 'PriceConditionFk',
						type: FieldType.Quantity,
						label: { text: 'PriceConditionFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MasterDataContextFk',
						model: 'MasterDataContextFk',
						type: FieldType.Quantity,
						label: { text: 'MasterDataContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEstimatePrice',
						model: 'IsEstimatePrice',
						type: FieldType.Boolean,
						label: { text: 'IsEstimatePrice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDayworkRate',
						model: 'IsDayworkRate',
						type: FieldType.Boolean,
						label: { text: 'IsDayworkRate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExternalCode',
						model: 'ExternalCode',
						type: FieldType.Description,
						label: { text: 'ExternalCode' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
