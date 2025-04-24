/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterValueValidationService
	 * @description provides validation methods for estimate rule parameter value.
	 */
	angular.module('estimate.main').factory('estimateMainRuleParameterValueValidationService',
		['$injector',
			function ($injector) {

				let datafactory = $injector.get('estimateMainRuleParameterDataServiceFactory');

				let options = {
					dataService: $injector.get('estimateMainRuleParameterValueDataServiceFactory'),
					parentService: datafactory
				};

				return $injector.get('estimateProjectEstRuleParamValueValidationFactory').createRuleParamValueValidationService(options);
			}
		]);
})();
