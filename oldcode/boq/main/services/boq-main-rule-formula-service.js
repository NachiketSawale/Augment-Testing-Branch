/**
 * Created by xia on 2/1/2018.
 */

(function (angular) {
	'use strict';

	angular.module('boq.main').factory('boqMainRuleFormulaService', [function () {

		var service = {};

		service.getRuleFormulaDesc = function getRuleFormulaDesc() {
			return 'Rule1 + Rule2';
		};

		service.getItemById = function () {
			return {RuleFormulaDesc: 'Walt'};
		};

		return service;
	}]);

})(angular);
