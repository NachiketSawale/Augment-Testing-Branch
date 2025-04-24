/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterValueProcessor
	 * @description estimate rule parameter value processor.
	 */
	angular.module(moduleName).factory('estimateMainRuleParameterValueProcessor', EstimateMainRuleParameterValueProcessor);
	EstimateMainRuleParameterValueProcessor.$inject = ['$injector', 'platformRuntimeDataService'];
	function EstimateMainRuleParameterValueProcessor($injector, platformRuntimeDataService) {
		let service = {};

		service.processItem = function processItem(item) {
			let isReadOnly = !$injector.get('estimateMainRuleDataService').isProjectRuleSelected();
			service.setReadOnly(item, isReadOnly);
		};

		service.processItems = function processItems(items) {
			angular.forEach(items, function (item) {
				service.processItem(item);
			});
		};

		service.setReadOnly = function setReadOnly(items, isReadOnly) {
			platformRuntimeDataService.readonly(items, isReadOnly);
		};

		return service;
	}
})(angular);