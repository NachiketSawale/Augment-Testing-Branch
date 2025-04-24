(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('ppsActivityModelFilterService',[
		'productionplanningActivityActivityDataService', 'ppsCommonModelFilterService',
		function (dataService, ppsCommonModelFilterService) {
			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService);
		}
	]);
})();