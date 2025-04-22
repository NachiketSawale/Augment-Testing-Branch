(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).service('salesContractAdvanceValidationService', [
		'prcAndSalesContractAdvanceValidationService',
		'salesContractAdvanceDataService',
		function (
			prcAndSalesContractAdvanceValidationService,
			salesContractAdvanceDataService
		) {
			var self = this; // jshint ignore:line

			angular.extend(self, prcAndSalesContractAdvanceValidationService(salesContractAdvanceDataService));
		}]);
})();