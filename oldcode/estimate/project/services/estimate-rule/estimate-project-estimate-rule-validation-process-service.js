/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimateProjectEstRuleMainValidationProcessService', estimateProjectEstRuleMainValidationProcessService);
	estimateProjectEstRuleMainValidationProcessService.$inject = ['$injector'];
	function estimateProjectEstRuleMainValidationProcessService($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateProjectEstRuleValidationService').validateCode(item, null, 'Code');
				$injector.get('estimateProjectEstRuleValidationService').validateEstRuleExecutionTypeFk(item, null, 'EstRuleExecutionTypeFk');
			}
		};
		return service;
	}
})(angular);
