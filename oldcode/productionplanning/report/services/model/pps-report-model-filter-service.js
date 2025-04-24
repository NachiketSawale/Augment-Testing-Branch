(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.report';
	angular.module(moduleName).factory('ppsReportModelFilterService',[
		'productionplanningReportReportDataService', 'ppsCommonModelFilterService',
		function (dataService, ppsCommonModelFilterService) {
			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService);
		}
	]);
})();