/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * estimate Assemblies total layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesTotalLayoutService {
	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IEstCostTotalEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['DescriptionInfo', 'QuantityTotal', 'UoM', 'CostTotal', 'Currency'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common', {
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					QuantityTotal: {
						key: 'entityQuantity',
						text: 'Quantity',
					},
					UoM: {
						key: 'entityUoM',
						text: 'UoM',
					},
					Currency: {
						key: 'entityCurrency',
						text: 'Currency',
					},
				}),
				...prefixAllTranslationKeys('estimate.main', {
					Total: {
						key: 'total',
						text: 'Total',
					},
				}),
			},
			overloads: {
				DescriptionInfo: {
					readonly: true,
				},
				QuantityTotal: {
					readonly: true,
				},
				UoM: {
					readonly: true,
				},
				CostTotal: {
					readonly: true,
				},
				Currency: {
					readonly: true,
				},
			},
		};
	}
}
