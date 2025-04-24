(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('procurementContractMandatoryDeadlineValidationProcessor', ProcurementContractMandatoryDeadlineValidationProcessor);
	ProcurementContractMandatoryDeadlineValidationProcessor.$inject = ['$injector'];
	function ProcurementContractMandatoryDeadlineValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['procurementContractMandatoryDeadlineValidationService', function (procurementContractMandatoryDeadlineValidationService) {
					procurementContractMandatoryDeadlineValidationService.validateStart(items, null, 'Start');
					procurementContractMandatoryDeadlineValidationService.validateEnd(items, null, 'End');
				}]);
			}
		};
		return service;
	}
})(angular);