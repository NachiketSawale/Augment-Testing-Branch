/**
 * Created by lnt on 9/29/2018.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParamValueValidationProcessService',['$injector',function ($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateRuleParamValueValidationService').validateDescription(item, null, 'Description');
			}
		};
		return service;
	}

	]);
})(angular);
