(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemDataStructureService', [
		'procurementPriceComparisonItemConfigService',
		'procurementPriceComparisonItemDataStructureServiceFactory',
		function (itemConfigService, itemDataStructureServiceFactory) {

			return itemDataStructureServiceFactory.getService(itemConfigService);
		}
	]);
})(angular);
