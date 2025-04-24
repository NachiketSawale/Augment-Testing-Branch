/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';

/**
 * Basics Cost Codes Price Version layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionLayoutService {

	public async generateConfig(): Promise<ILayoutConfiguration<ICostcodePriceVerEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: ['DescriptionInfo', 'PriceListFk', 'ValidFrom', 'ValidTo', 'DataDate', 'Weighting']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' }
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					PriceListFk: { key: 'priceVerion.pricelist' },
					Weighting: { key: 'priceVerion.weighting' },
					ValidFrom: { key: 'priceVerion.validfrom' },
					ValidTo: { key: 'priceVerion.validTo' },
					DataDate: { key: 'priceVerion.dataDate' }
				})
			},
			overloads: {
				PriceListFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceListLookupOverload(true)
			}
		};
	}
}
