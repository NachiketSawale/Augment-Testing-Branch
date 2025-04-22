(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractAdvanceDataService', [
		'prcAndSalesContractAdvanceDataService',
		'procurementContextService',
		function (
			dataServiceFactory,
			moduleContext
		) {
			var service = dataServiceFactory.getService(moduleContext.getMainService());

			return service;

		}
	]);
})();