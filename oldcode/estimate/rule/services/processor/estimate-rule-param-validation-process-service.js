/**
 * Created by mov on 9/29/2016.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParamValidationProcessService',['$injector',function ($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateRuleParamValidationService').validateCode(item, null, 'Code');
				$injector.get('estimateRuleParamValidationService').asyncValidateIsLookup(item, null, 'IsLookup');
			}
		};
		return service;
	}

	]);
})(angular);
