/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimateProjectEstimateRuleParameValidationProcessor',['$injector',function ($injector) {
		let service = {};

		service.validate = function validate(item) {
			if (item.Version === 0) {

				$injector.get('estimateProjectEstRuleParamValidationService').validateCode(item, null, 'Code');
				$injector.get('estimateProjectEstRuleParamValidationService').asyncValidateIsLookup(item, null, 'IsLookup');
				$injector.get('estimateProjectEstRuleParamValidationService').asyncValidateValueType(item, null, 'ValueType');
			}
		};
		return service;
	}

	]);
})(angular);
