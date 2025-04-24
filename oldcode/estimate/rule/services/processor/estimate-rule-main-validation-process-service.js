/**
 * Created by mov on 9/29/2016.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleMainValidationProcessService', estimateRuleMainValidationProcessor);
	estimateRuleMainValidationProcessor.$inject = ['$injector'];
	function estimateRuleMainValidationProcessor($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateRuleValidationService').validateCode(item, null, 'Code');
				$injector.get('estimateRuleValidationService').validateEstRuleExecutionTypeFk(item, null, 'EstRuleExecutionTypeFk');
			}
		};
		return service;
	}
})(angular);
