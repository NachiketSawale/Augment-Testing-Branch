/**
 * Created by lvy on 7/11/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementContractAdvanceDataService', [
		'prcAndSalesContractAdvanceDataService', 'procurementContextService',
		function (dataServiceFactory, moduleContext) {
			return dataServiceFactory.getService(moduleContext.getMainService());
		}
	]);
})(angular);