/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IBoqWic2assemblyEntity } from '@libs/boq/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * estimate total layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainAssemblyRelateLayoutService {
	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IBoqWic2assemblyEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'EstAssemblyCatFk',
						'BasUomFk',
						'Quantity',
						'QuantityDetail',
						'QuantityTotal',
						'QuantityUnitTarget',
						'CostUnit',
						'CostTotal',
						'CostUnitTarget',
						'HoursTotal',
						'HoursUnit',
						'HoursUnitTarget',
						'QuantityFactorDetail1',
						'QuantityFactorDetail2',
						'QuantityFactor1',
						'QuantityFactor2',
						'QuantityFactor3',
						'QuantityFactor4',
						'ProductivityFactor',
						'CostFactorDetail1',
						'CostFactorDetail2',
						'CostFactor1',
						'CostFactor2',
						'EstCostRiskFk',
						'IsLumpsum',
						'IsDisabled',
						'CommentText',
						'EstLineItemFk',
						'WorkContentInfo',
						'Wic2AssemblyQuantity',
						'WicEstAssembly2WicFlagFk',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('boq.main.', {
					EstAssemblyCatFk: {
						key: 'EstAssemblyCatFk',
						text: 'Assembly Category',
					},
					BasUomFk: {
						key: 'BasUomFk',
						text: 'UoM',
					},
					Quantity: {
						key: 'Quantity',
						text: 'Quantity',
					},
					QuantityDetail: {
						key: 'QuantityDetail',
						text: 'Quantity Detail',
					},
					HoursUnit: {
						key: 'HoursUnit',
						text: 'Hrs/Unit',
					},
					IsLumpsum: {
						key: 'IsLumpsum',
						text: 'Lump Sum',
					},
					IsDisabled: {
						key: 'IsDisabled',
						text: 'Disabled',
					},
					CommentText: {
						key: 'CommentText',
						text: 'Comment',
					},
					EstLineItemFk: {
						key: 'EstLineItemFk',
						text: 'Assembly Code',
					},
					WorkContentInfo: {
						key: 'WorkContentInfo',
						text: 'Work Content',
					},
					Wic2AssemblyQuantity: {
						key: 'Wic2AssemblyQuantity',
						text: 'Takeover Quantity',
					},
					WicEstAssembly2WicFlagFk: {
						key: 'WicEstAssembly2WicFlagFk',
						text: 'Takeover Mode',
					},
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					QuantityTotal: {
						key: 'quantityTotal',
						text: 'Quantity Total',
					},
					QuantityUnitTarget: {
						key: 'quantityUnitTarget',
						text: 'Quantity Unit Target',
					},
					CostUnit: {
						key: 'costUnit',
						text: 'Cost/Unit',
					},
					CostTotal: {
						key: 'costTotal',
						text: 'Cost Total',
					},
					CostUnitTarget: {
						key: 'costUnitTarget',
						text: 'Cost/Unit Item',
					},
					HoursTotal: {
						key: 'hoursTotal',
						text: 'Hours Total',
					},
					HoursUnitTarget: {
						key: 'hoursUnitTarget',
						text: 'Hours/Unit Item',
					},
					QuantityFactorDetail1: {
						key: 'quantityFactorDetail1',
						text: 'Quantity Factor Detail 1',
					},
					QuantityFactorDetail2: {
						key: 'quantityFactorDetail2',
						text: 'Quantity Factor Detail 2',
					},
					QuantityFactor1: {
						key: 'quantityFactor1',
						text: 'Quantity Factor 1',
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
					ProductivityFactor: {
						key: 'productivityFactor',
						text: 'Productivity Factor',
					},
					CostFactorDetail1: {
						key: 'costFactorDetail1',
						text: 'Cost Factor Details 1',
					},
					CostFactorDetail2: {
						key: 'costFactorDetail2',
						text: 'Cost Factor Details 2',
					},
					CostFactor1: {
						key: 'costFactor1',
						text: 'Cost Factor 1',
					},
					CostFactor2: {
						key: 'costFactor2',
						text: 'Cost Factor 2',
					},
					EstCostRiskFk: {
						key: 'estCostRiskFk',
						text: 'Cost Risk',
					},
				}),
			},
			overloads: {
				EstAssemblyCatFk: {
					readonly: true,
				},
				BasUomFk: {
					readonly: true,
				},
				Quantity: {
					readonly: true,
				},
				QuantityDetail: {
					readonly: true,
				},
				QuantityTotal: {
					readonly: true,
				},
				QuantityUnitTarget: {
					readonly: true,
				},
				CostUnit: {
					readonly: true,
				},
				CostTotal: {
					readonly: true,
				},
				CostUnitTarget: {
					readonly: true,
				},
				HoursTotal: {
					readonly: true,
				},
				HoursUnit: {
					readonly: true,
				},
				HoursUnitTarget: {
					readonly: true,
				},
				QuantityFactorDetail1: {
					readonly: true,
				},
				QuantityFactorDetail2: {
					readonly: true,
				},
				QuantityFactor1: {
					readonly: true,
				},
				QuantityFactor2: {
					readonly: true,
				},
				QuantityFactor3: {
					readonly: true,
				},
				QuantityFactor4: {
					readonly: true,
				},
				ProductivityFactor: {
					readonly: true,
				},
				CostFactorDetail1: {
					readonly: true,
				},
				CostFactorDetail2: {
					readonly: true,
				},
				CostFactor1: {
					readonly: true,
				},
				CostFactor2: {
					readonly: true,
				},
				EstCostRiskFk: {
					readonly: true,
				},
				IsLumpsum: {
					readonly: true,
				},
				IsDisabled: {
					readonly: true,
				},
				CommentText: {
					readonly: true,
				},
				EstLineItemFk: {
					readonly: true,
				},
				WorkContentInfo: {
					readonly: true,
				},
				Wic2AssemblyQuantity: {
					readonly: true,
				},
				WicEstAssembly2WicFlagFk: {
					readonly: true,
				},
			},
		};
	}
}
