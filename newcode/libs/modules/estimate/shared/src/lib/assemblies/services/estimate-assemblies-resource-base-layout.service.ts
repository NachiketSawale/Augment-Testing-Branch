/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IResourceBaseLayoutService } from '../../line-item/model/interfaces/estimate-resource-base-layout.service.interface';
import {
	BasicsSharedCustomizeLookupOverloadProvider
} from '@libs/basics/shared';

/**
 * assembly resource layout service
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesResourceBaseLayoutService<T extends IEstResourceEntity> implements IResourceBaseLayoutService<T> {

	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<T>> {
		return this.commonLayout() as ILayoutConfiguration<T>;
	}

	/**
	 * Common layout configuration for resource base entities
	 * @protected
	 */
	protected commonLayout(): ILayoutConfiguration<IEstResourceEntity> {
		return {
			'groups': [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'EstResourceTypeShortKey',
						'Code',
						'DescriptionInfo',
						'QuantityDetail',
						'Quantity',
						'BasUomFk',
						'QuantityFactorDetail1',
						'QuantityFactor1',
						'QuantityFactorDetail2',
						'QuantityFactor2',
						'QuantityFactor3',
						'QuantityFactor4',
						'ProductivityFactorDetail',
						'ProductivityFactor',
						'EfficiencyFactorDetail1',
						'EfficiencyFactor1',
						'EfficiencyFactorDetail2',
						'EfficiencyFactor2',
						'QuantityFactorCc',
						'QuantityReal',
						'QuantityInternal',
						'QuantityTotal',
						'CostUnit',
						'BasCurrencyFk',
						'CostFactorDetail1',
						'CostFactor1',
						'CostFactorDetail2',
						'CostFactor2',
						'CostFactorCc',
						'CostUnitSubItem',
						'CostUnitLineItem',
						'CostTotal',
						'HoursUnit',
						'HoursUnitSubItem',
						'HoursUnitLineItem',
						'HoursUnitTarget',
						'HoursTotal',
						'IsLumpsum',
						'IsDisabled',
						'CommentText',
						'IsIndirectCost',
						'Sorting',
						'EstResourceFlagFk',
						'EstCostTypeFk',
						'HourFactor',
						'DescriptionInfo1',
						'IsCost',
						'DayWorkRateUnit',
						'DayWorkRateTotal',
						'Co2Source',
						'Co2SourceTotal',
						'Co2Project',
						'Co2ProjectTotal',
						'CostUom'
					]
				}
			],
			'labels': {
				...prefixAllTranslationKeys('estimate.main.', {
					'EstResourceTypeShortKey': {
						'key': 'estResourceTypeFk',
						'text': 'Resource Type'
					},
					'QuantityDetail': {
						'key': 'quantityDetail',
						'text': 'Quantity Detail'
					},
					'QuantityFactorDetail1': {
						'key': 'quantityFactorDetail1',
						'text': 'Quantity Factor Detail 1'
					},
					'QuantityFactor1': {
						'key': 'quantityFactor1',
						'text': 'QuantityFactor1'
					},
					'QuantityFactorDetail2': {
						'key': 'quantityFactorDetail2',
						'text': 'Quantity Factor Detail 2'
					},
					'QuantityFactor2': {
						'key': 'quantityFactor2',
						'text': 'Quantity Factor 2'
					},
					'QuantityFactor3': {
						'key': 'quantityFactor3',
						'text': 'Quantity Factor 3'
					},
					'QuantityFactor4': {
						'key': 'quantityFactor4',
						'text': 'Quantity Factor 4'
					},
					'ProductivityFactorDetail': {
						'key': 'productivityFactorDetail',
						'text': 'Productivity Factor Detail'
					},
					'ProductivityFactor': {
						'key': 'productivityFactor',
						'text': 'Productivity Factor'
					},
					'EfficiencyFactorDetail1': {
						'key': 'efficiencyFactorDetail1',
						'text': 'Efficiency Factor Detail 1'
					},
					'EfficiencyFactor1': {
						'key': 'efficiencyFactor1',
						'text': 'Efficiency Factor 1'
					},
					'EfficiencyFactorDetail2': {
						'key': 'efficiencyFactorDetail2',
						'text': 'Efficiency Factor Detail 2'
					},
					'EfficiencyFactor2': {
						'key': 'efficiencyFactor2',
						'text': 'Efficiency Factor 2'
					},
					'QuantityFactorCc': {
						'key': 'quantityFactorCc',
						'text': 'Quantity Factor Cc'
					},
					'QuantityReal': {
						'key': 'quantityReal',
						'text': 'Quantity Real'
					},
					'QuantityInternal': {
						'key': 'quantityInternal',
						'text': 'Quantity Internal'
					},
					'QuantityTotal': {
						'key': 'quantityTotal',
						'text': 'Quantity Total'
					},
					'CostUnit': {
						'key': 'costUnit',
						'text': 'Cost Unit'
					},
					'CostFactorDetail1': {
						'key': 'costFactorDetail1',
						'text': 'Cost Factor Detail 1'
					},
					'CostFactor1': {
						'key': 'costFactor1',
						'text': 'Cost Factor 1'
					},
					'CostFactorDetail2': {
						'key': 'costFactorDetail2',
						'text': 'Cost Factor Detail 2'
					},
					'CostFactor2': {
						'key': 'costFactor2',
						'text': 'Cost Factor 2'
					},
					'CostFactorCc': {
						'key': 'costFactorCc',
						'text': 'Cost Factor Cc'
					},
					'CostUnitSubItem': {
						'key': 'costUnitSubItem',
						'text': 'CostUnitSubItem'
					},
					'CostUnitLineItem': {
						'key': 'costUnitLineItem',
						'text': 'CostUnitLineItem'
					},
					'CostTotal': {
						'key': 'costTotal',
						'text': 'Cost Total'
					},
					'HoursUnit': {
						'key': 'hoursUnit',
						'text': 'Hours Unit'
					},
					'HoursUnitSubItem': {
						'key': 'hoursUnitSubItem',
						'text': 'HoursUnitSubItem'
					},
					'HoursUnitLineItem': {
						'key': 'hoursUnitLineItem',
						'text': 'HoursUnitLineItem'
					},
					'HoursUnitTarget': {
						'key': 'hoursUnitTarget',
						'text': 'Hours Unit Target'
					},
					'HoursTotal': {
						'key': 'hoursTotal',
						'text': 'Hours Total'
					},
					'IsLumpsum': {
						'key': 'isLumpSum',
						'text': 'Is LumpSum'
					},
					'IsDisabled': {
						'key': 'isDisabled',
						'text': 'Is Disabled'
					},
					'CommentText': {
						'key': 'comment',
						'text': 'Comment'
					},
					'IsIndirectCost': {
						'key': 'isIndirectCost',
						'text': 'Indirect Cost'
					},
					'EstResourceFlagFk': {
						'key': 'resourceFlag',
						'text': 'Resource Flag'
					},
					'HourFactor': {
						'key': 'hourFactor',
						'text': 'Hour Factor'
					},
					'DescriptionInfo1': {
						'key': 'descriptionInfo1',
						'text': 'Further Description'
					},
					'IsCost': {
						'key': 'isCost',
						'text': 'Is Cost'
					},
					'DayWorkRateUnit': {
						'key': 'dayWorkRateUnit',
						'text': 'DW/T+M Rate'
					},
					'DayWorkRateTotal': {
						'key': 'dayWorkRateTotal',
						'text': 'DW/T+M Rate Total'
					},
					'CostUom': {
						'key': 'costInternal',
						'text': 'Cost/UoM'
					}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					'Code': {
						'key': 'entityCode',
						'text': 'Code'
					},
					'DescriptionInfo': {
						'key': 'entityDescription',
						'text': 'Description'
					},
					'Quantity': {
						'key': 'entityQuantity',
						'text': 'Quantity'
					},
					'BasUomFk': {
						'key': 'entityUoM',
						'text': 'UoM'
					},
					'BasCurrencyFk': {
						'key': 'entityCurrency',
						'text': 'Currency'
					},
					'Sorting': {
						'key': 'entitySorting',
						'text': 'Sorting'
					}
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					'EstCostTypeFk': {
						'key': 'costType',
						'text': 'Cost Type'
					}
				}),
				...prefixAllTranslationKeys('basics.common.', {
					'Co2Source': {
						'key': 'sustainabilty.entityCo2Source',
						'text': 'CO2/kg (Source)'
					},
					'Co2SourceTotal': {
						'key': 'sustainabilty.entityCo2SourceTotal',
						'text': 'CO2 (Source) Total'
					},
					'Co2Project': {
						'key': 'sustainabilty.entityCo2Project',
						'text': 'CO2/kg (Project)'
					},
					'Co2ProjectTotal': {
						'key': 'sustainabilty.entityCo2ProjectTotal',
						'text': 'CO2 (Project) Total'
					}
				})
			},
			'overloads': {
				'QuantityFactorCc': {
					'readonly': true
				},
				'QuantityReal': {
					'readonly': true
				},
				'QuantityInternal': {
					'readonly': true
				},
				'QuantityTotal': {
					'readonly': true
				},
				'CostFactorCc': {
					'readonly': true
				},
				'CostUnitSubItem': {
					'readonly': true
				},
				'CostTotal': {
					'readonly': true
				},
				'HoursUnit': {
					'readonly': true
				},
				'HoursUnitSubItem': {
					'readonly': true
				},
				'HoursUnitLineItem': {
					'readonly': true
				},
				'HoursUnitTarget': {
					'readonly': true
				},
				'HoursTotal': {
					'readonly': true
				},
				'HourFactor': {
					'readonly': true
				},
				'DayWorkRateTotal': {
					'readonly': true
				},
				'Co2Source': {
					'readonly': true
				},
				'Co2SourceTotal': {
					'readonly': true
				},
				'Co2ProjectTotal': {
					'readonly': true
				},
				EstCostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),
				EstResourceFlagFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceFlagLookupOverload(true)
			}
		};
	}
}