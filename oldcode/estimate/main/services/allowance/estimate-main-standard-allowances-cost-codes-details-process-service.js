

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estStandardAllowancesCostCodeDetailValidationProcessService', estStandardAllowancesCostCodeDetailValidationProcessService);
	estStandardAllowancesCostCodeDetailValidationProcessService.$inject = ['$injector'];
	function estStandardAllowancesCostCodeDetailValidationProcessService($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateMainStandardAllowancesValidationService').validateCode(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);