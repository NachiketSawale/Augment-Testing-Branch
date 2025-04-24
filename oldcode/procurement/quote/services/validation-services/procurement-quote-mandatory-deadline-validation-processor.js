(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteMandatoryDeadlineValidationProcessor', ProcurementQuoteMandatoryDeadlineValidationProcessor);
	ProcurementQuoteMandatoryDeadlineValidationProcessor.$inject = ['$injector'];
	function ProcurementQuoteMandatoryDeadlineValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['procurementQuoteMandatoryDeadlineValidationService', function (procurementQuoteMandatoryDeadlineValidationService) {
					procurementQuoteMandatoryDeadlineValidationService.validateStart(items, null, 'Start');
					procurementQuoteMandatoryDeadlineValidationService.validateEnd(items, null, 'End');
				}]);
			}
		};
		return service;
	}
})(angular);