/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IMaterialPortionEntity } from '../model/entities/material-portion-entity.interface';

/**
 * Basics Material Portion layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPortionLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterialPortionEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Code',
						'Description',
						'CostPerUnit',
						'IsEstimatePrice',
						'IsDayworkRate',
						'MdcCostCodeFk',
						'PrcPriceConditionFk',
						'PriceExtra',
						'Quantity',
						'MaterialPortionTypeFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Code': {
						'key': 'entityCode',
						'text': 'Code'
					},
					'Description': {
						'key': 'entityDescription',
						'text': 'Description'
					},
					'MdcCostCodeFk': {
						'key': 'entityCostCode',
						'text': 'Cost Code'
					},
					'PrcPriceConditionFk': {
						'key': 'entityPriceCondition',
						'text': 'Price Condition'
					}
				}),
				...prefixAllTranslationKeys('procurement.stock.', {
					'Quantity': {
						'key': 'stocktotal.Quantity',
						'text': 'Quantity'
					}
				}),
				...prefixAllTranslationKeys('basics.material.', {
					'CostPerUnit': {
						'key': 'portion.costPerUnit',
						'text': 'Cost Per Unit'
					},
					'IsEstimatePrice': {
						'key': 'portion.isEstimatePrice',
						'text': 'Is Estimate Price'
					},
					'IsDayworkRate': {
						'key': 'portion.isDayworkRate',
						'text': 'Is Daywork Rate'
					},
					'PriceExtra': {
						'key': 'portion.priceExtras',
						'text': 'Price Extras'
					},
					'MaterialPortionTypeFk': {
						'key': 'portion.materialPortionType',
						'text': 'Material Portion Type'
					}
				})
			},
			overloads: {
				'PriceExtra': {
					'readonly': true
				},
				MdcCostCodeFk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
				PrcPriceConditionFk: BasicsSharedLookupOverloadProvider.providePriceConditionLookupOverload(true),
				MaterialPortionTypeFk: BasicsSharedLookupOverloadProvider.provideMaterialPortionTypeLookupOverload(true)
			}
		};
	}
}