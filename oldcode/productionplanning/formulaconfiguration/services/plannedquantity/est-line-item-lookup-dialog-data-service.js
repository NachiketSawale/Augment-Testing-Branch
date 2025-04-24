(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsPlannedQuantityEstLineItemLookupDialogDataService', ['lookupFilterDialogDataService',
		function (filterLookupDataService) {
			const options = {};
			return filterLookupDataService.createInstance(options);
		}]);
})(angular);