/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

/**
 * price adjustment layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimatePriceAdjustmentLayoutService {
	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IEstPriceAdjustmentItemData>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Reference',
						'Reference2',
						'BriefInfo',
						'BasUomFk',
						'BoqItemFlagFk',
						'BoqLineTypeFk',
						'Factor',
						'EpnaEstimagted',
						'StatusImage',
						'BasCurrencyFk',
						'Comment',
						'ItemInfo',
						'Urb1Estimated',
						'Urb1Delta',
						'Urb1Adjustment',
						'Urb1Tender',
						'Urb2Estimated',
						'Urb2Delta',
						'Urb2Adjustment',
						'Urb2Tender',
						'Urb3Estimated',
						'Urb3Delta',
						'Urb3Adjustment',
						'Urb3Tender',
						'Urb4Estimated',
						'Urb4Delta',
						'Urb4Adjustment',
						'Urb4Tender',
						'Urb5Estimated',
						'Urb5Delta',
						'Urb5Adjustment',
						'Urb5Tender',
						'Urb6Estimated',
						'Urb6Delta',
						'Urb6Adjustment',
						'Urb6Tender',
						'WqQuantity',
						'WqEstimatedPrice',
						'WqAdjustmentPrice',
						'WqTenderPrice',
						'WqDeltaPrice',
						'AqQuantity',
						'AqEstimatedPrice',
						'AqAdjustmentPrice',
						'AqTenderPrice',
						'AqDeltaPrice',
						'UrEstimated',
						'UrDelta',
						'UrAdjustment',
						'UrTender',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Reference: {
						key: 'entityReference',
						text: 'Reference',
					},
					BriefInfo: {
						key: 'entityBriefInfo',
						text: 'Outline Specification',
					},
					BasUomFk: {
						key: 'entityUoM',
						text: 'UoM',
					},
					BasCurrencyFk: {
						key: 'entityCurrency',
						text: 'Currency',
					},
				}),
				...prefixAllTranslationKeys('boq.main.', {
					Reference2: {
						key: 'Reference2',
						text: 'Reference No. 2',
					},
					BoqLineTypeFk: {
						key: 'BoqLineTypeFk',
						text: 'BoQ Line Type',
					},
					Factor: {
						key: 'FactorItem',
						text: 'Factor',
					},
					ItemInfo: {
						key: 'ItemInfo',
						text: 'Item Info',
					},
				}),
				...prefixAllTranslationKeys('estimate.main.priceAdjust.', {
					BoqItemFlagFk: {
						key: 'boqItemFlagFk',
						text: 'BoQ Item Flag',
					},
					EpnaEstimagted: {
						key: 'EpnaEstimagted',
						text: 'Ep Na Estimated',
					},
					StatusImage: {
						key: 'StatusImage',
						text: 'Status',
					},
					Comment: {
						key: 'comment',
						text: 'Comment',
					},
					Urb1Estimated: {
						key: 'UrbEstimated',
						text: 'URB1 Estimated',
						params: { num: 1 },
					},
					Urb1Delta: {
						key: 'UrbDelta',
						text: 'URB1 Delta',
						params: { num: 1 },
					},
					Urb1Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB1 Adjustment',
						params: { num: 1 },
					},
					Urb1Tender: {
						key: 'UrbTender',
						text: 'URB1 Tender',
						params: { num: 1 },
					},
					Urb2Estimated: {
						key: 'UrbEstimated',
						text: 'URB2 Estimated',
						params: { num: 2 },
					},
					Urb2Delta: {
						key: 'UrbDelta',
						text: 'URB2 Delta',
						params: { num: 2 },
					},
					Urb2Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB2 Adjustment',
						params: { num: 2 },
					},
					Urb2Tender: {
						key: 'UrbTender',
						text: 'URB2 Tender',
						params: { num: 2 },
					},
					Urb3Estimated: {
						key: 'UrbEstimated',
						text: 'URB3 Estimated',
						params: { num: 3 },
					},
					Urb3Delta: {
						key: 'UrbDelta',
						text: 'URB3 Delta',
						params: { num: 3 },
					},
					Urb3Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB3 Adjustment',
						params: { num: 3 },
					},
					Urb3Tender: {
						key: 'UrbTender',
						text: 'URB3 Tender',
						params: { num: 3 },
					},
					Urb4Estimated: {
						key: 'UrbEstimated',
						text: 'URB4 Estimated',
						params: { num: 4 },
					},
					Urb4Delta: {
						key: 'UrbDelta',
						text: 'URB4 Delta',
						params: { num: 4 },
					},
					Urb4Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB4 Adjustment',
						params: { num: 4 },
					},
					Urb4Tender: {
						key: 'UrbTender',
						text: 'URB4 Tender',
						params: { num: 4 },
					},
					Urb5Estimated: {
						key: 'UrbEstimated',
						text: 'URB5 Estimated',
						params: { num: 5 },
					},
					Urb5Delta: {
						key: 'UrbDelta',
						text: 'URB5 Delta',
						params: { num: 5 },
					},
					Urb5Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB5 Adjustment',
						params: { num: 5 },
					},
					Urb5Tender: {
						key: 'UrbTender',
						text: 'URB5 Tender',
						params: { num: 5 },
					},
					Urb6Estimated: {
						key: 'UrbEstimated',
						text: 'URB6 Estimated',
						params: { num: 6 },
					},
					Urb6Delta: {
						key: 'UrbDelta',
						text: 'URB6 Delta',
						params: { num: 6 },
					},
					Urb6Adjustment: {
						key: 'UrbAdjustment',
						text: 'URB6 Adjustment',
						params: { num: 6 },
					},
					Urb6Tender: {
						key: 'UrbTender',
						text: 'URB6 Tender',
						params: { num: 6 },
					},
					WqQuantity: {
						key: 'WqQuantity',
						text: 'WQ Quantity',
					},
					WqEstimatedPrice: {
						key: 'WqEstimatedPrice',
						text: 'Estimated Price WQ',
					},
					WqAdjustmentPrice: {
						key: 'WqAdjustmentPrice',
						text: 'Adjusted Price WQ',
					},
					WqTenderPrice: {
						key: 'WqTenderPrice',
						text: 'Tender Price WQ',
					},
					WqDeltaPrice: {
						key: 'WqDeltaPrice',
						text: 'Delta Price WQ',
					},
					AqQuantity: {
						key: 'AqQuantity',
						text: 'AQ Quantity',
					},
					AqEstimatedPrice: {
						key: 'AqEstimatedPrice',
						text: 'Estimated Price AQ',
					},
					AqAdjustmentPrice: {
						key: 'AqAdjustmentPrice',
						text: 'Adjusted Price AQ',
					},
					AqTenderPrice: {
						key: 'AqTenderPrice',
						text: 'Tender Price AQ',
					},
					AqDeltaPrice: {
						key: 'AqDeltaPrice',
						text: 'Delta Price AQ',
					},
					UrEstimated: {
						key: 'UrEstimated',
						text: 'UR Estimated',
					},
					UrDelta: {
						key: 'UrDelta',
						text: 'UR Delta',
					},
					UrAdjustment: {
						key: 'UrAdjustment',
						text: 'UR Adjustment',
					},
					UrTender: {
						key: 'UrTender',
						text: 'UR Tender',
					},
				}),
			},
			overloads: {
				Reference: {
					readonly: true,
				},
				Reference2: {
					readonly: true,
				},
				BriefInfo: {
					readonly: true,
					type: FieldType.Translation,
					formatterOptions: {
						field: 'BriefInfo.Translated',
					},
				},
				BasUomFk: {
					readonly: true,
				},
				BoqItemFlagFk: {
					readonly: true,
				},
				BoqLineTypeFk: {
					readonly: true,
				},
				Factor: {
					readonly: true,
				},
				EpnaEstimagted: {
					readonly: true,
				},
				StatusImage: {
					readonly: true,
				},
				BasCurrencyFk: {
					readonly: true,
				},
				ItemInfo: {
					readonly: true,
				},
			},
		};
	}

	public getAllFields(): string[] {
		return [
			'Reference',
			'Reference2',
			'BriefInfo',
			'BasUomFk',
			'BoqItemFlagFk',
			'BoqLineTypeFk',
			'Factor',
			'EpnaEstimagted',
			'StatusImage',
			'BasCurrencyFk',
			'Comment',
			'ItemInfo',
			'Urb1Estimated',
			'Urb1Delta',
			'Urb1Adjustment',
			'Urb1Tender',
			'Urb2Estimated',
			'Urb2Delta',
			'Urb2Adjustment',
			'Urb2Tender',
			'Urb3Estimated',
			'Urb3Delta',
			'Urb3Adjustment',
			'Urb3Tender',
			'Urb4Estimated',
			'Urb4Delta',
			'Urb4Adjustment',
			'Urb4Tender',
			'Urb5Estimated',
			'Urb5Delta',
			'Urb5Adjustment',
			'Urb5Tender',
			'Urb6Estimated',
			'Urb6Delta',
			'Urb6Adjustment',
			'Urb6Tender',
			'WqQuantity',
			'WqEstimatedPrice',
			'WqAdjustmentPrice',
			'WqTenderPrice',
			'WqDeltaPrice',
			'AqQuantity',
			'AqEstimatedPrice',
			'AqAdjustmentPrice',
			'AqTenderPrice',
			'AqDeltaPrice',
			'UrEstimated',
			'UrDelta',
			'UrAdjustment',
			'UrTender',
		];
	}

	public NotReadonlyFields(): string[] {
		return [
			'Comment',
			'UrDelta',
			'UrAdjustment',
			'UrTender',
			'Urb1Delta',
			'Urb1Adjustment',
			'Urb1Tender',
			'Urb2Delta',
			'Urb2Adjustment',
			'Urb2Tender',
			'Urb3Delta',
			'Urb3Adjustment',
			'Urb3Tender',
			'Urb4Delta',
			'Urb4Adjustment',
			'Urb4Tender',
			'Urb5Delta',
			'Urb5Adjustment',
			'Urb5Tender',
			'Urb6Delta',
			'Urb6Adjustment',
			'Urb6Tender',
			'WqAdjustmentPrice',
			'WqTenderPrice',
			'WqDeltaPrice',
			'AqQuantity',
			'AqAdjustmentPrice',
			'AqTenderPrice',
			'AqDeltaPrice',
		];
	}
}
