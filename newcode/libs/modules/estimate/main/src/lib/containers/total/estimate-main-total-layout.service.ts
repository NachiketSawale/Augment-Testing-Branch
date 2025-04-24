/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';

/**
 * estimate total layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainTotalLayoutService {
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
					attributes: [
						'DescriptionInfo',
						'Quantity',
						'AQDayWorkRateTotal',
						'WQDayWorkRateTotal',
						'UoM',
						'Total',
						'Currency',
						'AQCostTotal',
						'AQBudget',
						'AQRevenue',
						'AQMargin',
						'WQCostTotal',
						'WQBudget',
						'WQRevenue',
						'WQMargin',
						'CostExchangeRate1',
						'CostExchangeRate2',
						'Currency1Fk',
						'Currency2Fk',
						'ForeignBudget1',
						'ForeignBudget2',
						'RiskCostTotal',
						'EscalationCostTotal',
						'GrandTotal',
						'FromDJC',
						'FromTJC',
						'CO2SourceTotal',
						'CO2ProjectTotal',
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					Quantity: {
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
					}
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					AQDayWorkRateTotal: {
						key: 'aQDayWorkRateTotal',
						text: 'DW/T+M Rate Total(AQ)',
					},
					WQDayWorkRateTotal: {
						key: 'wQDayWorkRateTotal',
						text: 'DW/T+M Rate Total(WQ)'
					},
					Total: {
						key: 'total',
						text: 'Total'
					},
					AQCostTotal: {
						key: 'aQCostTotal',
						text: 'Total(AQ)'
					},
					AQBudget: {
						key: 'aQBudget',
						text: 'Budget(AQ)'
					},
					AQRevenue: {
						key: 'aQRevenue',
						text: 'Revenue(AQ)'
					},
					AQMargin: {
						key: 'aQMargin',
						text: 'Margin(AQ)'
					},
					WQCostTotal: {
						key: 'wQCostTotal',
						text: 'Total(WQ)'
					},
					WQBudget: {
						key: 'wQBudget',
						text: 'Budget(WQ)'
					},
					WQRevenue: {
						key: 'wQRevenue',
						text: 'Revenue(WQ)'
					},
					WQMargin: {
						key: 'wQMargin',
						text: 'Margin(WQ)'
					},
					CostExchangeRate1: {
						key: 'costExchangeRate1',
						text: 'Cost Foreign Total 1'
					},
					CostExchangeRate2: {
						key: 'costExchangeRate2',
						text: 'Cost Foreign Total 2'
					},
					Currency1Fk: {
						key: 'currency1Fk',
						text: 'Foreign Currency 1'
					},
					Currency2Fk: {
						key: 'currency2Fk',
						text: 'Foreign Currency 2'
					},
					ForeignBudget1: {
						key: 'foreignBudget1',
						text: 'Foreign Budget 1'
					},
					ForeignBudget2: {
						key: 'foreignBudget2',
						text: 'Foreign Budget 2'
					},
					RiskCostTotal: {
						key: 'costRiskTotal',
						text: 'Risk Cost Total'
					},
					EscalationCostTotal: {
						key: 'escalationCostTotal',
						text: 'Escalation Cost Total'
					},
					GrandTotal: {
						key: 'grandTotal',
						text: 'Grand Total'
					},
					FromDJC: {
						key: 'FromDJC',
						text: '% from DJC'
					},
					FromTJC: {
						key: 'FromTJC',
						text: '% from TJC'
					},
					CO2SourceTotal: {
						key: 'totalContainerCo2SourceTotal',
						text: 'CO2/Kg (Source) Total'
					},
					CO2ProjectTotal: {
						key: 'totalContainerCo2ProjectTotal',
						text: 'CO2/Kg (Project) Total'
					}
				})
			},
			overloads: {
				DescriptionInfo: {
					readonly: true
				},
				Quantity: {
					readonly: true
				},
				AQDayWorkRateTotal: {
					readonly: true
				},
				WQDayWorkRateTotal: {
					readonly: true
				},
				UoM: {
					readonly: true
				},
				Currency: {
					readonly: true
				},
				AQCostTotal: {
					readonly: true
				},
				AQBudget: {
					readonly: true
				},
				AQRevenue: {
					readonly: true
				},
				AQMargin: {
					readonly: true
				},
				WQCostTotal: {
					readonly: true
				},
				WQBudget: {
					readonly: true
				},
				WQRevenue: {
					readonly: true
				},
				WQMargin: {
					readonly: true
				},
				Currency1Fk: {
					readonly: true
				},
				Currency2Fk: {
					readonly: true
				},
				ForeignBudget1: {
					readonly: true
				},
				ForeignBudget2: {
					readonly: true
				},
				RiskCostTotal: {
					readonly: true
				},
				EscalationCostTotal: {
					readonly: true
				},
				GrandTotal: {
					readonly: true
				},
				CO2SourceTotal: {
					readonly: true
				},
				CO2ProjectTotal: {
					readonly: true
				},
			},
		};
	}
}
