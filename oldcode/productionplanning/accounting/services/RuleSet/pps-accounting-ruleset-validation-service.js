/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionpalnningAccountingRuleSetValidationService', RuleSetValidationService);

	RuleSetValidationService.$inject = [];

	function RuleSetValidationService() {

		return {};
	}

})(angular);