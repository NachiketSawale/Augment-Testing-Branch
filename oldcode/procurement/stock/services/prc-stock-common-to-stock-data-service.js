/**
 * Created by lcn on 9/20/2021.
 */
(function () {
	'use strict';
	/* global _ */
	var moduleName = 'procurement.stock';

	// procurementStock2ProjectStockDownTimeDataService
	angular.module(moduleName).factory('procurementStock2ProjectStockDownTimeDataService', ['projectStockDownTimeDataService', 'procurementStockHeaderDataService',
		function (dataService, parentService) {
			return dataService.createService(parentService, 'procurementStock2ProjectStockDownTimeDataService', true);
		}]);
})();
