/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPrrItemE2cEntity } from '../model/entities/prr-item-e2c-entity.interface';

/**
 * Controlling Revenue Recognition Item layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemE2cLayoutService {

	/**
	 * Generate layout config
	 */

	public async generateLayout(): Promise<ILayoutConfiguration<IPrrItemE2cEntity>> {

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
						'EstimatedCost',
						'TotalCost',
						'ActualCost',
						'ActualCostPercent',
						'ContractedValue',
						'CalculatedRevenue',
						'CalculatedRevenuePercent',
						'ActualRevenue',
						'RevenueAccrual',
						'RevenueAccrualPercent',
						'RevenueToComplete'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Code': {
						text: 'Code',
						key: 'entityCode'
					}
				}),
				...prefixAllTranslationKeys('controlling.revrecognition.', {
					'EstimatedCost': {
						text: 'Estimated Total Cost',
						key: 'entityEstimatedCost'
					},
					'TotalCost': {
						text: 'Baseline Total Cost',
						key: 'entityTotalCost'
					},
					'ActualCost': {
						text: 'Actual Cost to Period',
						key: 'entityActualCost'
					},
					'ActualCostPercent': {
						text: '% Used Cost',
						key: 'entityActualCostPercent'
					},
					'ContractedValue': {
						text: 'Contracted Price (Sales)',
						key: 'entityContractedValue'
					},
					'CalculatedRevenue': {
						text: 'Accrued Revenue (Cumulative)',
						key: 'entityCalculatedRevenue'
					},
					'CalculatedRevenuePercent': {
						text: '% Accrued Revenue (Cumulative)',
						key: 'entityCalculatedRevenuePercent'
					},
					'ActualRevenue': {
						text: 'Accrued Revenue(Prior Periods)',
						key: 'entityHeaderDate'
					},
					'RevenueAccrual': {
						text: 'Accrued Revenue(Current Periods)',
						key: 'entityRelevantDate'
					},
					'RevenueAccrualPercent': {
						text: '% Accrued Revenue(Current Periods)',
						key: 'entityRevenueAccrualPercent'
					},
					'RevenueToComplete': {
						text: 'Remaining to Complete',
						key: 'entityRevenueToComplete'
					}
				}),
			}
		};
	}
}