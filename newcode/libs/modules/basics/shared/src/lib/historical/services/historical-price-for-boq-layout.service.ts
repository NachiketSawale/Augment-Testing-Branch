/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsSharedHistoricalPriceForBoqEntity } from '../model/entities/historical-price-for-boq-entity.interface';
import { BasicsSharedUomLookupService } from '../../lookup-services/basics-uom-lookup.service';
/**
 * Historical price for boq layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedHistoricalPriceForBoqLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBasicsSharedHistoricalPriceForBoqEntity>> {
		return <ILayoutConfiguration<IBasicsSharedHistoricalPriceForBoqEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'SourceType',
						'Status',
						'Code',
						'DescriptionInfo',
						'UnitRate',
						'CorrectedUnitRate',
						'UomFk',
						'Date',
						'BusinessPartnerFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					UnitRate: { key: 'wizard.updateItemPrice.unitRate', text: 'Unit Rate' }
				}),
				...prefixAllTranslationKeys('basic.common.', {
					SourceType: { key: 'historicalPrice.sourceType', text: 'Source Type' },
					CorrectedUnitRate: { key: 'historicalPrice.correctedUnitRate', text: 'Corrected Unit Rate' },
					UomFk: { key: 'historicalPrice.uom', text: 'UoM' },
					Status: { key: 'historicalPrice.status', text: 'Status' },
					Date: { key: 'historicalPrice.date', text: 'Date' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'cloud.common.entityCode', text: 'Code' },
					BusinessPartnerFk: { key: 'businessPartner', text: 'Business Partner' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				})
			},
			overloads: {
				UomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					}),
					readonly: true
				}
			}
		};
	}
}