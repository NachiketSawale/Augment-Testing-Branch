/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterValueEntityValidator
	 * @description provides validation methods for estimate rule parameter value new Entity.
	 */
	angular.module(moduleName).factory('estimateMainRuleParameterValueEntityValidator', EstimateMainRuleParameterValueValidatorService);
	EstimateMainRuleParameterValueValidatorService.$inject = ['$injector'];
	function EstimateMainRuleParameterValueValidatorService($injector) {
		let service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.get('estimateMainRuleParameterValueValidationService').validateDescription(item, null, 'Code');
			}
		};
		return service;
	}
})(angular);