/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

/**
 * Cos assembly resource layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyResourceLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IEstResourceEntity>> {
		const IBasicsCurrencyLookupProvider = await this.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'EstCostTypeFk',
						'EstResourceTypeShortKey',
						'DescriptionInfo1',
						'QuantityDetail',
						'Quantity',
						'BasUomFk',
						'QuantityFactorDetail1',
						'QuantityFactor1',
						'QuantityFactorDetail2',
						'QuantityFactor2',
						'QuantityFactor3',
						'QuantityFactor4',
						'QuantityFactorCc',
						'ProductivityFactorDetail',
						'ProductivityFactor',
						'EfficiencyFactorDetail1',
						'EfficiencyFactor1',
						'EfficiencyFactorDetail2',
						'EfficiencyFactor2',
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
						'HourFactor',
						'IsLumpsum',
						'IsDisabled',
						'IsIndirectCost',
						'CommentText',
						'EstResourceFlagFk',
						'IsCost',
						'Sorting',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.costcodes.', {
					EstCostTypeFk: {
						key: 'costType',
						text: 'Cost Type',
					},
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					ProductivityFactorDetail: {
						key: 'productivityFactorDetail',
						text: 'Productivity Factor Detail',
					},
					ProductivityFactor: {
						key: 'productivityFactor',
						text: 'Productivity Factor',
					},
					EfficiencyFactorDetail1: {
						key: 'efficiencyFactorDetail1',
						text: 'Efficiency Factor Detail 1',
					},
					EfficiencyFactor1: {
						key: 'efficiencyFactor1',
						text: 'Efficiency Factor 1',
					},
					EfficiencyFactorDetail2: {
						key: 'efficiencyFactorDetail2',
						text: 'Efficiency Factor Detail 2',
					},
					EfficiencyFactor2: {
						key: 'efficiencyFactor2',
						text: 'Efficiency Factor 2',
					},
					QuantityFactorDetail1: {
						key: 'quantityFactorDetail1',
						text: 'Quantity Factor Detail 1',
					},
					QuantityFactor1: {
						key: 'quantityFactor1',
						text: 'QuantityFactor1',
					},
					QuantityFactorDetail2: {
						key: 'quantityFactorDetail2',
						text: 'Quantity Factor Detail 2',
					},
					QuantityFactor2: {
						key: 'quantityFactor2',
						text: 'Quantity Factor 2',
					},
					QuantityFactor3: {
						key: 'quantityFactor3',
						text: 'Quantity Factor 3',
					},
					QuantityFactor4: {
						key: 'quantityFactor4',
						text: 'Quantity Factor 4',
					},
					QuantityFactorCc: {
						key: 'quantityFactorCc',
						text: 'Quantity Factor Cc',
					},
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					EstResourceTypeShortKey: {
						key: 'resourceShortKey',
						text: 'Resource Type',
					},
					QuantityDetail: {
						key: 'quantityDetail',
						text: 'Quantity Detail',
					},
					QuantityReal: {
						key: 'quantityReal',
						text: 'Quantity Real',
					},
					QuantityInternal: {
						key: 'quantityInternal',
						text: 'Quantity Internal',
					},
					QuantityTotal: {
						key: 'quantityTotal',
						text: 'Quantity Total',
					},
					CostUnit: {
						key: 'costUnit',
						text: 'Cost Unit',
					},
					CostFactorDetail1: {
						key: 'costFactorDetail1',
						text: 'Cost Factor Detail 1',
					},
					CostFactor1: {
						key: 'costFactor1',
						text: 'Cost Factor 1',
					},
					CostFactorDetail2: {
						key: 'costFactorDetail2',
						text: 'Cost Factor Detail 2',
					},
					CostFactor2: {
						key: 'costFactor2',
						text: 'Cost Factor 2',
					},
					CostFactorCc: {
						key: 'costFactorCc',
						text: 'Cost Factor Cc',
					},
					CostUnitSubItem: {
						key: 'costUnitSubItem',
						text: 'CostUnitSubItem',
					},
					CostUnitLineItem: {
						key: 'costUnitLineItem',
						text: 'CostUnitLineItem',
					},
					CostTotal: {
						key: 'costTotal',
						text: 'Cost Total',
					},
					HoursUnit: {
						key: 'hoursUnit',
						text: 'Hours Unit',
					},
					HoursUnitSubItem: {
						key: 'hoursUnitSubItem',
						text: 'HoursUnitSubItem',
					},
					HoursUnitLineItem: {
						key: 'hoursUnitLineItem',
						text: 'HoursUnitLineItem',
					},
					HoursUnitTarget: {
						key: 'hoursUnitTarget',
						text: 'Hours Unit Target',
					},
					HoursTotal: {
						key: 'hoursTotal',
						text: 'Hours Total',
					},
					IsLumpsum: {
						key: 'isLumpSum',
						text: 'Is LumpSum',
					},
					IsDisabled: {
						key: 'isDisabled',
						text: 'Is Disabled',
					},
					CommentText: {
						key: 'comment',
						text: 'Comment',
					},
					IsIndirectCost: {
						key: 'isIndirectCost',
						text: 'Indirect Cost',
					},
					EstResourceFlagFk: {
						key: 'resourceFlag',
						text: 'Resource Flag',
					},
					HourFactor: {
						key: 'hourFactor',
						text: 'Hour Factor',
					},
					DescriptionInfo1: {
						key: 'descriptionInfo1',
						text: 'Further Description',
					},
					IsCost: {
						key: 'isCost',
						text: 'Is Cost',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Quantity: {
						key: 'entityQuantity',
						text: 'Quantity',
					},
					BasUomFk: {
						key: 'entityUoM',
						text: 'UoM',
					},
					BasCurrencyFk: {
						key: 'entityCurrency',
						text: 'Currency',
					},
					Sorting: {
						key: 'entitySorting',
						text: 'Sorting',
					},
				}),
			},
			overloads: {
				QuantityFactorCc: {
					readonly: true,
				},
				QuantityReal: {
					readonly: true,
				},
				QuantityInternal: {
					readonly: true,
				},
				QuantityTotal: {
					readonly: true,
				},
				CostFactorCc: {
					readonly: true,
				},
				CostUnitSubItem: {
					readonly: true,
				},
				CostTotal: {
					readonly: true,
				},
				HoursUnit: {
					readonly: true,
				},
				HoursUnitSubItem: {
					readonly: true,
				},
				HoursUnitLineItem: {
					readonly: true,
				},
				HoursUnitTarget: {
					readonly: true,
				},
				HoursTotal: {
					readonly: true,
				},
				HourFactor: {
					readonly: true,
				},
				DayWorkRateTotal: {
					readonly: true,
				},
				BasCurrencyFk: IBasicsCurrencyLookupProvider.provideCurrencyLookupOverload({
					showClearButton: true,
				}),
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				EstCostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),
				EstResourceFlagFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceFlagLookupOverload(true),
			},
		};
	}
}
