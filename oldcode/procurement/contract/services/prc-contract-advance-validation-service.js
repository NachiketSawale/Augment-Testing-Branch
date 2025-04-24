/**
 * Created by lvy on 8/1/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	angular.module(moduleName).service('procurementContractAdvanceValidationService', [
		'prcAndSalesContractAdvanceValidationService',
		'procurementContractAdvanceDataService',
		function (
			prcAndSalesContractAdvanceValidationService,
			procurementContractAdvanceDataService
		) {
			var self = this; // jshint ignore:line

			angular.extend(self, prcAndSalesContractAdvanceValidationService(procurementContractAdvanceDataService));
		}]);
})(angular);