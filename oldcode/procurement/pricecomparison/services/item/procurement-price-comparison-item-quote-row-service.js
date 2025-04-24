(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemQuoteRowService', [
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonQuoteRowServiceFactory',
		function (commonService,
			itemService,
			quoteRowServiceFactory) {

			return quoteRowServiceFactory.createService('procurementPriceComparisonItemQuoteRowService', itemService, {
				compareType: commonService.constant.compareType.prcItem
			});
		}
	]);
})(angular);
