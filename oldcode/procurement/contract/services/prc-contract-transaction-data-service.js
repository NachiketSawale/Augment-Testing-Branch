/**
 * Created by Ivy on 06.24.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementContractTransactionDataService',
		['prcAndSalesContractTransactionDataService','procurementContextService',
			function (dataServiceFactory, moduleContext) {
				return dataServiceFactory.getService(moduleContext.getMainService());
			}]);
})(angular);