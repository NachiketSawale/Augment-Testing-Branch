/**
 * Created by lnt on 16.08.2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estAssemblyMainModule = angular.module(moduleName);
	estAssemblyMainModule.factory('estAssemblyRuleParamIconProcess', [ function () {
		let service = {};
		// to show the rule and parameter icon
		service.processItem = function processItem(item) {
			item.Param = [];
		};
		return service;
	}]);
})();