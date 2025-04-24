(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsPlannedQuantityEstResourceLookupDialogDataService', ['lookupFilterDialogDataService',
		function (filterLookupDataService) {
			const options = {};
			return filterLookupDataService.createInstance(options);
		}]);
})(angular);