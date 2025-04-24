(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('procurementContractCallOffAgreementValidationProcessor', ProcurementContractCallOffAgreementValidationProcessor);
	ProcurementContractCallOffAgreementValidationProcessor.$inject = ['$injector'];

	function ProcurementContractCallOffAgreementValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['procurementContractCallOffAgreementValidationService', function (procurementContractCallOffAgreementValidationService) {
					procurementContractCallOffAgreementValidationService.validateEarliestStart(items, null, 'EarliestStart');
					procurementContractCallOffAgreementValidationService.validateLatestStart(items, null, 'LatestStart');
				}]);
			}
		};
		return service;
	}
})(angular);