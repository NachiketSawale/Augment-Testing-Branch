/**
 * Created by lnt on 16.08.2021.
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	estimateMainModule.factory('estMainRuleParamIconProcess', [ function () {
		let service = {};
		// to show the rule and parameter icon
		service.processItem = function processItem(item) {
			item.Rule = [];
			item.Param = [];
		};
		return service;
	}]);
})();