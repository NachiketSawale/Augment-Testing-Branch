/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractTransactionDataService',
		['prcAndSalesContractTransactionDataService','procurementContextService',
			function (dataServiceFactory, moduleContext) {
				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				return dataService;
			}]);
})(angular);