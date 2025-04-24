/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.project';

	angular.module(moduleName).factory('estimatePrjRuleParamValueValidationProcessService',['$injector',function ($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateProjectEstRuleParamValueValidationService').validateDescription(item, null, 'Description');
			}
		};
		return service;
	}

	]);
})(angular);
