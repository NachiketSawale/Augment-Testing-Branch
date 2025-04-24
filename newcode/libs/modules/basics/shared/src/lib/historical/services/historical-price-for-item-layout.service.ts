/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsSharedHistoricalPriceForItemEntity } from '../model/entities/historical-price-for-item-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '../../lookup-helper/basics-shared-lookup-overload-provider.class';

/**
 * Historical price for item layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedHistoricalPriceForItemLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBasicsSharedHistoricalPriceForItemEntity>> {
		return <ILayoutConfiguration<IBasicsSharedHistoricalPriceForItemEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'ItemCodeAndDesc',
						'SourceType',
						'SourceCodeAndDesc',
						'MaterialPriceListId',
						'ConvertedUnitRate',
						'VarianceFormatter',
						'UomId',
						'PriceUnit',
						'Weighting',
						'Date',
						'ProjectId',
						'BusinessPartnerId',
						'Co2Project',
						'Co2Source',
						'UpdateDate',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					ItemCodeAndDesc: { key: 'wizard.updateItemPrice.itemCodeAndDesc', text: 'Item Code / Description' },
					SourceCodeAndDesc: { key: 'wizard.updateItemPrice.sourceCodeAndDesc', text: 'Source Code / Description' },
					MaterialPriceListId: { key: 'wizard.updateItemPrice.unitRate', text: 'Unit Rate' },
					ConvertedUnitRate: { key: 'wizard.updateItemPrice.convertedUnitRate', text: 'Converted Unit Rate' },
					Weighting: { key: 'wizard.updateItemPrice.entityWeighting', text: 'Weighting' },
					VarianceFormatter: { key: 'wizard.replaceNeutralMaterial.variance', text: 'Variant' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					SourceType: { key: 'historicalPrice.sourceType', text: 'Source Type' },
					Co2Project: { key: 'sustainabilty.entityCo2Project', text: 'CO2/kg (Project)' },
					Co2Source: { key: 'sustainabilty.entityBasCo2SourceFk', text: 'CO2/kg (Source)' },
					UpdateDate: { key: 'poChange.UpdateDate', text: 'Update Date' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomId: { key: 'entityUoM', text: 'Uom' },
					PriceUnit: { key: 'entityPriceUnit', text: 'Price Unit' },
					Date: { key: 'entityDate', text: 'Date' },
					ProjectId: { key: 'entityProjectName', text: 'Project' },
					BusinessPartnerId: { key: 'businessPartner', text: 'Business Partner' },
				}),
			},
			overloads: {
				UomId: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload()
			},
		};
	}
}
