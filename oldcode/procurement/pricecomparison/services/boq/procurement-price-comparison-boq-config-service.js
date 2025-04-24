(function (angular) {
	'use strict';
	const moduleName = 'procurement.pricecomparison';

	/**
	 *This constant describes the boq compare field id.
	 */
	angular.module(moduleName).value('procurementPriceComparisonBoqCompareRows', {
		cost: 'Cost',
		unitRateFrom: 'UnitRateFrom',
		unitRateTo: 'UnitRateTo',
		urBreakdown1: 'Urb1',
		urBreakdown2: 'Urb2',
		urBreakdown3: 'Urb3',
		urBreakdown4: 'Urb4',
		urBreakdown5: 'Urb5',
		urBreakdown6: 'Urb6',
		price: 'Price',
		priceOc: 'PriceOc',
		discountPercentIT: 'DiscountPercentIt',         // Discount %IT (only for Level 1-9, Root)
		discount: 'Discount',                           // Discount ABS.IT (only for Level 1-9, Root)
		discountPercent: 'DiscountPercent',             // Discount % UR (for Position)
		discountedPrice: 'DiscountedPrice',
		discountedUnitPrice: 'DiscountedUnitprice',     // note: lower case
		finalPrice: 'Finalprice',                       // note: lower case
		rank: 'Rank',
		percentage: 'Percentage',
		commentContractor: 'CommentContractor',         // bidder comments
		commentClient: 'CommentClient',                 // client comments
		quantity: 'Quantity',                           // quantity
		prcItemEvaluationFk: 'PrcItemEvaluationFk',     // item evaluation
		bidderComments: 'BidderComments',
		userDefined1: 'Userdefined1',
		userDefined2: 'Userdefined2',
		userDefined3: 'Userdefined3',
		userDefined4: 'Userdefined4',
		userDefined5: 'Userdefined5',
		alternativeBid: 'BasItemType85Fk',
		finalPriceOc: 'FinalpriceOc',
		summaryStandardTotal: 10010,
		summaryStandardABS: 10011,
		summaryStandardPercent: 10012,
		summaryStandardDiscountTotal: 10013,
		summaryOptionalITTotal: 10020,
		summaryOptionalITABS: 10021,
		summaryOptionalITPercent: 10022,
		summaryOptionalITDiscountTotal: 10023,
		summaryOptionalWITTotal: 10030,
		summaryOptionalWITABS: 10031,
		summaryOptionalWITPercent: 10032,
		summaryOptionalWITDiscountTotal: 10033,
		summaryGrandTotal: 10040,
		summaryGrandABS: 10041,
		summaryGrandPercent: 10042,
		summaryGrandDiscountTotal: 10043,
		summaryAlternativeTotal: 10050,
		summaryAlternativeABS: 10051,
		summaryAlternativePercent: 10052,
		summaryAlternativeDiscountTotal: 10053,
		itemTotal: 'ItemTotal',
		itemTotalOc: 'ItemTotalOc',
		lumpsumPrice: 'LumpsumPrice',
		isLumpsum: 'IsLumpsum',
		boqTotalRank: 'BoqTotalRank',
		remark: 'Remark',
		absoluteDifference: 'AbsoluteDifference',
		externalCode: 'ExternalCode',
		priceGross: 'Pricegross',
		priceGrossOc: 'PricegrossOc',
		finalGross: 'Finalgross',
		finalGrossOc: 'FinalgrossOc',
		notSubmitted: 'NotSubmitted',
		included: 'Included',
		budgetTotal: 'BudgetTotal',
		uomFk: 'UomFk',
		factor: 'Factor',
		extraIncrement: 'ExtraIncrement',
		extraIncrementOc: 'ExtraIncrementOc',
		exQtnIsEvaluated: 'ExQtnIsEvaluated',
		discountOc: 'DiscountOc',
		prjChangeFk: 'PrjChangeFk',
		prjChangeStatusFk: 'PrjChangeStatusFk',
		quantityAdj: 'QuantityAdj',
		quantityAdjDetail: 'QuantityAdjDetail',
		prcPriceConditionFk: 'PrcPriceConditionFk'
	});

	angular.module(moduleName).factory('procurementPriceComparisonBoqConfigService', [
		'procurementPriceComparisonBoqConfigFactory',
		function (boqConfigFactory) {

			return boqConfigFactory.getService();
		}
	]);
})(angular);
