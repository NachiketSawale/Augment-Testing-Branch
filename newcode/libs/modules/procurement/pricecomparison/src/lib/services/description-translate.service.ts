/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isObject } from 'lodash';
import { PlatformTranslateService, TranslationParamsSource } from '@libs/platform/common';

export type TranslationTerm = string | { descriptor: string, param: object };
export type TranslationDescriptors = { [p: string]: { [p: string]: TranslationTerm } };

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonDescriptionTranslateService {
	private readonly translateService = inject(PlatformTranslateService);

	private _descriptors: TranslationDescriptors = {
		quote: {
			Code: 'cloud.common.entityCode',
			CurrencyFk: 'cloud.common.entityCurrency',
			DatePricefixing: 'procurement.quote.headerDataPricefixing',
			DateQuoted: 'procurement.quote.headerDateQuoted',
			DateReceived: 'cloud.common.entityReceived',
			Description: 'cloud.common.entityDescription',
			EvaluationRank: 'procurement.pricecomparison.evaluationRank',
			EvaluationResult: 'procurement.pricecomparison.evaluationResult',
			ExchangeRate: 'cloud.common.entityRate',
			PaymentTermFiFk: 'cloud.common.entityPaymentTermFI',
			PaymentTermPaFk: 'cloud.common.entityPaymentTermPA',
			QuoteVersion: 'procurement.quote.headerVersion',
			StatusFk: 'cloud.common.entityState',
			GrandTotalRank: 'procurement.pricecomparison.grandTotalRank',
			Characteristics: 'procurement.pricecomparison.compareCharacteristicTotal',
			UserDefined1: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '1'
				}
			},
			UserDefined2: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '2'
				}
			},
			UserDefined3: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '3'
				}
			},
			UserDefined4: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '4'
				}
			},
			UserDefined5: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '5'
				}
			},
			Remark: 'procurement.pricecomparison.remark',
			OverallDiscount: 'procurement.common.entityOverallDiscount',
			OverallDiscountOc: 'procurement.common.entityOverallDiscountOc',
			OverallDiscountPercent: 'procurement.common.entityOverallDiscountPercent',
			UserDefinedDate01: {
				descriptor: 'procurement.quote.entityUserDefinedDate',
				param: {
					p_0: '1'
				}
			},
			Turnover: 'procurement.pricecomparison.turnover',
			AvgEvaluationA: 'businesspartner.main.avgEvaluationA',
			AvgEvaluationB: 'businesspartner.main.avgEvaluationB',
			AvgEvaluationC: 'businesspartner.main.avgEvaluationC',
			AvgEvaluationRank: 'procurement.pricecomparison.avgEvaluationRank',
			EvaluatedTotal: 'procurement.pricecomparison.compareEvaluatedTotal',
			OfferedTotal: 'procurement.pricecomparison.compareOfferedTotal',
			IncotermFk: 'cloud.common.entityIncoterms'
		},
		boq: {
			Cost: 'boq.main.Cost',
			UnitRateFrom: 'boq.main.UnitRateFrom',
			UnitRateTo: 'boq.main.UnitRateTo',
			Urb1: 'boq.main.Urb1',
			Urb2: 'boq.main.Urb2',
			Urb3: 'boq.main.Urb3',
			Urb4: 'boq.main.Urb4',
			Urb5: 'boq.main.Urb5',
			Urb6: 'boq.main.Urb6',
			Price: 'boq.main.Price',
			Discount: 'boq.main.Discount',
			DiscountPercent: 'boq.main.DiscountPercent',
			DiscountedPrice: 'boq.main.DiscountedPrice',
			DiscountedUnitprice: 'boq.main.DiscountedUnitprice',
			Finalprice: 'boq.main.Finalprice',
			Rank: 'procurement.pricecomparison.rank',
			Percentage: 'procurement.pricecomparison.percentage',
			CommentContractor: 'boq.main.CommentContractor',
			Quantity: 'boq.main.Quantity',
			PrcItemEvaluationFk: 'boq.main.PrcItemEvaluationFk',
			CommentClient: 'boq.main.CommentClient',
			BidderComments: 'procurement.pricecomparison.bidderComments',
			PriceOc: 'boq.main.PriceOc',
			FinalpriceOc: 'boq.main.FinalpriceOc',
			Userdefined1: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '1'
				}
			},
			Userdefined2: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '2'
				}
			},
			Userdefined3: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '3'
				}
			},
			Userdefined4: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '4'
				}
			},
			Userdefined5: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '5'
				}
			},
			DiscountPercentIt: 'boq.main.DiscountPercentIt',
			BasItemType85Fk: 'boq.main.ItemType85Fk',
			ItemTotal: 'boq.main.ItemTotal',
			ItemTotalOc: 'boq.main.ItemTotalOc',
			LumpsumPrice: 'boq.main.LumpsumPrice',
			IsLumpsum: 'boq.main.IsLumpsum',
			Generals: 'procurement.common.general.generalsContainerGridTitle',
			BoqTotalRank: 'procurement.pricecomparison.boqTotalRank',
			AbsoluteDifference: 'procurement.pricecomparison.absoluteDifference',
			ExternalCode: 'procurement.common.externalCode',
			Pricegross: 'boq.main.Pricegross',
			PricegrossOc: 'boq.main.PricegrossOc',
			Finalgross: 'boq.main.Finalgross',
			FinalgrossOc: 'boq.main.FinalgrossOc',
			NotSubmitted: 'boq.main.NotSubmitted',
			Included: 'boq.main.Included',
			UomFk: 'cloud.common.entityUoM',
			Factor: 'boq.main.Factor',
			ExtraIncrement: 'boq.main.ExtraIncrement',
			ExtraIncrementOc: 'boq.main.ExtraIncrementOc',
			ExQtnIsEvaluated: 'procurement.common.exQtnIsEvaluated'
		},
		item: {
			Price: 'cloud.common.entityPrice',
			PriceExtra: 'procurement.common.prcItemPriceExtras',
			TotalPrice: 'procurement.common.prcItemTotalPrice',
			PriceUnit: 'cloud.common.entityPriceUnit',
			Total: 'cloud.common.entityTotal',
			Rank: 'procurement.pricecomparison.rank',
			Percentage: 'procurement.pricecomparison.percentage',
			PrcItemEvaluationFk: 'cloud.common.entityItemEvaluation',
			Userdefined1: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '1'
				}
			},
			Userdefined2: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '2'
				}
			},
			Userdefined3: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '3'
				}
			},
			Userdefined4: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '4'
				}
			},
			Userdefined5: {
				descriptor: 'cloud.common.entityUserDefined',
				param: {
					p_0: '5'
				}
			},
			LeadTime: 'procurement.common.entityLeadTime',
			LeadTimeExtra: 'procurement.common.leadTimeExtra',
			BufferLeadTime: 'procurement.common.bufferLeadTime',
			SafetyLeadTime: 'procurement.common.safetyLeadTime',
			TotalLeadTime: 'procurement.common.totalLeadTime',
			Quantity: 'cloud.common.entityQuantity',
			PriceOc: 'procurement.common.prcItemPriceCurrency',
			TotalOc: 'procurement.common.prcItemTotalCurrency',
			PrcPriceConditionFk: 'cloud.common.entityPriceCondition',
			BasItemType85Fk: 'boq.main.ItemType85Fk',
			TotalNoDiscount: 'procurement.common.prcItemTotalNoDiscount',
			TotalOcNoDiscount: 'procurement.common.prcItemTotalCurrencyNoDiscount',
			Discount: 'procurement.common.Discount',
			DiscountAbsolute: 'procurement.common.DiscountAbsolute',
			DiscountComment: 'procurement.common.DiscountComment',
			TotalGross: 'procurement.common.totalGross',
			TotalOCGross: 'procurement.common.totalOcGross',
			PriceGross: 'procurement.common.priceGross',
			PriceOCGross: 'procurement.common.priceOcGross',
			TotalPriceGross: 'procurement.common.totalPriceGross',
			TotalPriceOCGross: 'procurement.common.totalPriceGrossOc',
			PriceExtraOc: 'procurement.common.prcItemPriceExtrasCurrency',
			Generals: 'procurement.common.general.generalsContainerGridTitle',
			CommentContractor: 'boq.main.CommentContractor',
			CommentClient: 'boq.main.CommentClient',
			FactoredQuantity: 'procurement.common.prcItemFactoredQuantity',
			IsFreeQuantity: 'procurement.common.isFreeQuantity',
			AbsoluteDifference: 'procurement.pricecomparison.absoluteDifference',
			DiscountSplit: 'procurement.common.DiscountSplitEntity',
			DiscountSplitOc: 'procurement.common.DiscountSplitOcEntity',
			ExternalCode: 'procurement.common.externalCode',
			UomFk: 'cloud.common.entityUoM',
			FactorPriceUnit: 'basics.customize.factorPriceUnit',
			ExQtnIsEvaluated: 'procurement.common.exQtnIsEvaluated',
			DiscountAbsoluteOc: 'procurement.common.DiscountAbsoluteOc',
			DiscountAbsoluteGross: 'procurement.common.DiscountAbsoluteGross',
			DiscountAbsoluteGrossOc: 'procurement.common.DiscountAbsoluteGrossOc',
			NotSubmitted: 'boq.main.NotSubmitted',
			PaymentTermPaFk: 'cloud.common.entityPaymentTermPA',
			PaymentTermFiFk: 'cloud.common.entityPaymentTermFI',
			Co2Project: 'procurement.common.entityCo2Project',
			Co2ProjectTotal: 'procurement.common.entityCo2ProjectTotal',
			Co2Source: 'procurement.common.entityCo2Source',
			Co2SourceTotal: 'procurement.common.entityCo2SourceTotal',
			PrjChangeFk: 'procurement.common.projectChange',
			PrjChangeStatusFk: 'procurement.common.projectChangeStatus',
			FactoredTotalPrice: 'procurement.common.item.prcItemFactoredTotalPrice'
		}
	};

	public getDisplayText(descType: string | null, descField: string | null, userLabel?: string | null, defaultText?: string) {
		if (userLabel) {
			return userLabel;
		}
		if (!descType || !descField) {
			return defaultText;
		}
		if (this._descriptors[descType] && this._descriptors[descType][descField]) {
			const result = this._descriptors[descType][descField] as string | { descriptor: string, param: object };
			let descriptor: string;
			let param: TranslationParamsSource | undefined = undefined;
			if (isObject(result)) {
				descriptor = result.descriptor;
				param = result.param;
			} else {
				descriptor = result;
			}
			return this.translateService.instant(descriptor, param).text;
		}
		return defaultText;
	}

	public getQuoteDisplayText(descField: string, userLabel?: string | null, defaultText?: string) {
		return this.getDisplayText('quote', descField, userLabel, defaultText);
	}

	public getItemDisplayText(descField: string, userLabel?: string | null, defaultText?: string) {
		return this.getDisplayText('item', descField, userLabel, defaultText);
	}

	public getBoqDisplayText(descField: string, userLabel?: string | null, defaultText?: string) {
		return this.getDisplayText('boq', descField, userLabel, defaultText);
	}

	public getBillingSchemaDisplayText(descField: string, userLabel?: string | null, defaultText?: string) {
		return this.getDisplayText(null, null, userLabel, defaultText);
	}
}