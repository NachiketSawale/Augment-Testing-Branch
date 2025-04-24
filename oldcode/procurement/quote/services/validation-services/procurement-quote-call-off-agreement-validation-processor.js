(function (angular) {
	'use strict';

	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementQuoteCallOffAgreementValidationProcessor', ProcurementQuoteCallOffAgreementValidationProcessor);
	ProcurementQuoteCallOffAgreementValidationProcessor.$inject = ['$injector'];
	function ProcurementQuoteCallOffAgreementValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['procurementQuoteCallOffAgreementValidationService', function (procurementQuoteCallOffAgreementValidationService) {
					procurementQuoteCallOffAgreementValidationService.validateEarliestStart(items, null, 'EarliestStart');
					procurementQuoteCallOffAgreementValidationService.validateLatestStart(items, null, 'LatestStart');
				}]);
			}
		};
		return service;
	}
})(angular);