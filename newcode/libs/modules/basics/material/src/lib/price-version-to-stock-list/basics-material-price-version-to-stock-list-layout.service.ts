/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IStock2matPriceverEntity } from '../model/entities/stock-2-mat-pricever-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { get } from 'lodash';

/**
 * Basics Material Price Version To Stock List layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToStockListLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IStock2matPriceverEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['PrjStockFk', 'MdcMatPriceverFk', 'ValidFrom'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PrjStockFk: { key: 'entityStock', text: 'Stock' },
					ValidFrom: { key: 'entityValidFrom', text: 'Valid From' },
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MdcMatPriceverFk: {
						key: 'priceList.materialPriceVersion',
						text: 'Price Version',
					},
				}),
			},
			overloads: {
				PrjStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload({
					readonly: true,
				}),
				MdcMatPriceverFk: BasicsSharedLookupOverloadProvider.provideMaterialPriceVersionLookupOverload(false, {
					key: '',
					execute: (context) => {
						return {
							MaterialCatalogFk: get(context.entity, 'MdcMaterialCatalogFk'),
						};
					},
				}),
			},
		};
	}
}