(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).factory('ppsMountingModelFilterService',[
		'productionplanningMountingRequisitionDataService', 'ppsCommonModelFilterService',
		function (dataService, ppsCommonModelFilterService) {
			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService);
		}
	]);
})();