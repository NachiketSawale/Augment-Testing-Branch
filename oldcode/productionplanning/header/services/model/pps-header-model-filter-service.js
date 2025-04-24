(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('ppsHeaderModelFilterService',[
		'productionplanningHeaderDataService', 'ppsCommonModelFilterService',
		function (dataService, ppsCommonModelFilterService) {
			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService);
		}
	]);
})();