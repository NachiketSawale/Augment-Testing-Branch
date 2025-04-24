/**
 * Created by wed on 3/22/2019.
 */
(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonTranslationDescriptionService', ['$translate',
		function ($translate) {
			let descriptors = {
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
					PaymentTermPaDesc: 'cloud.common.entityPaymentTermPaDescription',
					PaymentTermFiDesc: 'cloud.common.entityPaymentTermFiDescription',
					QuoteVersion: 'procurement.quote.headerVersion',
					StatusFk: 'cloud.common.entityState',
					GrandTotalRank: 'procurement.pricecomparison.grandTotalRank',
					Characteristics: 'procurement.pricecomparison.compareCharacteristicTotal',
					UserDefined1: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '1'// jshint ignore: line
						}
					},
					UserDefined2: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '2'// jshint ignore: line
						}
					},
					UserDefined3: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '3'// jshint ignore: line
						}
					},
					UserDefined4: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '4'// jshint ignore: line
						}
					},
					UserDefined5: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '5'// jshint ignore: line
						}
					},
					Remark: 'procurement.pricecomparison.remark',
					OverallDiscount: 'procurement.common.entityOverallDiscount',
					OverallDiscountOc: 'procurement.common.entityOverallDiscountOc',
					OverallDiscountPercent: 'procurement.common.entityOverallDiscountPercent',
					UserDefinedDate01: {
						descriptor: 'procurement.quote.entityUserDefinedDate',
						param: {
							p_0: '1'// jshint ignore: line
						}
					},
					Turnover: 'procurement.pricecomparison.turnover',
					AvgEvaluationA: 'businesspartner.main.avgEvaluationA',
					AvgEvaluationB: 'businesspartner.main.avgEvaluationB',
					AvgEvaluationC: 'businesspartner.main.avgEvaluationC',
					AvgEvaluationRank: 'procurement.pricecomparison.avgEvaluationRank',
					EvaluatedTotal: 'procurement.pricecomparison.compareEvaluatedTotal',
					OfferedTotal: 'procurement.pricecomparison.compareOfferedTotal',
					IncotermFk: 'cloud.common.entityIncoterms',
					AmountDiscountBasis: 'procurement.quote.entityAmountDiscountBasis',
					AmountDiscountBasisOc: 'procurement.quote.entityAmountDiscountBasisOc',
					PercentDiscount: 'procurement.quote.entityPercentDiscount',
					AmountDiscount: 'procurement.quote.entityAmountDiscount',
					AmountDiscountOc: 'procurement.quote.entityAmountDiscountOc'
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
							p_0: '1'// jshint ignore: line
						}
					},
					Userdefined2: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '2'// jshint ignore: line
						}
					},
					Userdefined3: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '3'// jshint ignore: line
						}
					},
					Userdefined4: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '4'// jshint ignore: line
						}
					},
					Userdefined5: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '5'// jshint ignore: line
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
					ExQtnIsEvaluated: 'procurement.common.exQtnIsEvaluated',
					PrjChangeFk: 'procurement.common.projectChange',
					PrjChangeStatusFk: 'procurement.common.projectChangeStatus',
					QuantityAdj: 'boq.main.QuantityAdj',
					PrcPriceConditionFk: 'cloud.common.entityPriceCondition'
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
							p_0: '1'// jshint ignore: line
						}
					},
					Userdefined2: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '2'// jshint ignore: line
						}
					},
					Userdefined3: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '3'// jshint ignore: line
						}
					},
					Userdefined4: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '4'// jshint ignore: line
						}
					},
					Userdefined5: {
						descriptor: 'cloud.common.entityUserDefined',
						param: {
							p_0: '5'// jshint ignore: line
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
					TotalCurrencyNoDiscount: 'procurement.common.prcItemTotalCurrencyNoDiscount',
					Discount: 'procurement.common.Discount',
					DiscountAbsolute: 'procurement.common.DiscountAbsolute',
					DiscountComment: 'procurement.common.DiscountComment',
					TotalGross: 'procurement.common.totalGross',
					TotalGrossOc: 'procurement.common.totalOcGross',
					PriceGross: 'procurement.common.priceGross',
					PriceGrossOc: 'procurement.common.priceOcGross',
					TotalPriceGross: 'procurement.common.totalPriceGross',
					TotalPriceGrossOc: 'procurement.common.totalPriceGrossOc',
					PriceExtraOc: 'procurement.common.prcItemPriceExtrasCurrency',
					Generals: 'procurement.common.general.generalsContainerGridTitle',
					CommentContractor: 'boq.main.CommentContractor',
					CommentClient: 'boq.main.CommentClient',
					QuantityConverted: 'procurement.common.prcItemFactoredQuantity',
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
					FactoredTotalPrice: 'procurement.common.item.prcItemFactoredTotalPrice',
					Charge: 'procurement.common.entityCharge',
					ChargeOc:'procurement.common.entityChargeOc'
				}
			};

			function getDisplayText(descType, descField, userLabel, defaultText) {
				if (userLabel) {
					return userLabel;
				}
				if (descriptors[descType] && descriptors[descType][descField]) {
					let result = descriptors[descType][descField], descriptor, param = null;
					if (angular.isObject(result)) {
						descriptor = result.descriptor;
						param = result.param;
					} else {
						descriptor = result;
					}
					return $translate.instant(descriptor, param);
				}
				return defaultText;
			}

			function getQuoteDisplayText(descField, userLabel, defaultText) {
				return getDisplayText('quote', descField, userLabel, defaultText);
			}

			function getItemDisplayText(descField, userLabel, defaultText) {
				return getDisplayText('item', descField, userLabel, defaultText);
			}

			function getBoqDisplayText(descField, userLabel, defaultText) {
				return getDisplayText('boq', descField, userLabel, defaultText);
			}

			function getBillingSchemaDisplayText(descField, userLabel, defaultText) {
				return getDisplayText(null, null, userLabel, defaultText);
			}

			return {
				getQuoteDisplayText: getQuoteDisplayText,
				getItemDisplayText: getItemDisplayText,
				getBoqDisplayText: getBoqDisplayText,
				getBillingSchemaDisplayText: getBillingSchemaDisplayText
			};

		}]);
})(angular);
