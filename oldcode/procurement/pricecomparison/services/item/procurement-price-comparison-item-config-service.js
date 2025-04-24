(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemConfigService', [
		'procurementPriceComparisonItemConfigFactory',
		function (itemConfigFactory) {
			return itemConfigFactory.getService();

		}
	]);
})(angular);
