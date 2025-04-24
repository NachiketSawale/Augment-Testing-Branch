(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqDataStructureService', [
		'procurementPriceComparisonBoqConfigService',
		'procurementPriceComparisonBoqDataStructureFactory',
		function (boqConfigService,
			boqDataStructureFactory) {

			return boqDataStructureFactory.getService(boqConfigService);
		}
	]);
})(angular);
