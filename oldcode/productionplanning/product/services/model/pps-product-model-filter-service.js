(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('ppsProductModelFilterService',[
		'productionplanningProductMainService', 'ppsCommonModelFilterService',
		function (dataService, ppsCommonModelFilterService) {
			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService);
		}
	]);
})();