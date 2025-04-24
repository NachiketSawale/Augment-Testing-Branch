(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqQuoteRowService', [
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonQuoteRowServiceFactory',
		function (commonService,
			boqService,
			quoteRowServiceFactory) {

			return quoteRowServiceFactory.createService('procurementPriceComparisonBoqQuoteRowService', boqService, {
				compareType: commonService.constant.compareType.boqItem
			});

		}]);
})(angular);
