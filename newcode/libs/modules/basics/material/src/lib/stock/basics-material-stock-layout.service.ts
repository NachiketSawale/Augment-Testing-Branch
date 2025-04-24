/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterial2ProjectStockEntity } from '../model/entities/material-2-project-stock-entity.interface';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

/**
 * Basics Material Stock layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialStockLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterial2ProjectStockEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'ProjectFk',
						'ProjectStockFk',
						'MinQuantity',
						'MaxQuantity',
						'ProvisionPercent',
						'ProvisionPeruom',
						'IsLotManagement',
						'StockLocationFk',
						'StandardCost'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'ProjectStockFk': {'key': 'entityStock', 'text': 'Stock'},
					'ProjectFk': {'key': 'entityProjectNo', 'text': 'Project No.'}
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					'StockLocationFk': {'key': 'entityPrjStockLocation', 'text': 'Stock Location'}
				}),
				...prefixAllTranslationKeys('project.stock.', {
					'MinQuantity': {key: 'minQuantity', text: 'Minimum Quantity'},
					'MaxQuantity': {key: 'maxQuantity', text: 'Maximum Quantity'},
					'ProvisionPercent': {'key': 'provisionPercent', 'text': 'Provision Percent'},
					'ProvisionPeruom': {'key': 'provisionPerUoM', 'text': 'Provision Per UoM'},
					'IsLotManagement': {'key': 'isLotManagement', 'text': 'Is Lot Management'},
					'StandardCost': {'key': 'standardCost', 'text': 'Standard Cost'}
				})
			},
			overloads: {
				ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectStock2ProjectOptionLookupOverload({
					showClearButton: true,
					serverSideFilter: {
						key: 'material-stock-project-filter',
						execute: (context) => {
							return {
								ProjectStockFk: context.entity?.ProjectStockFk,
							};
						}
					}
				}),
				ProjectStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload(),
				StockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationOptionLookupOverload({
					showClearButton: true
				})
			}
		};
	}
}