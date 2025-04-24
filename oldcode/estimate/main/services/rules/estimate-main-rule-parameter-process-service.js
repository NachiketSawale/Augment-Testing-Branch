/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterProcessor
	 * @description estimate rule parameter processor.
	 */
	angular.module(moduleName).factory('estimateMainRuleParameterProcessor', EstimateMainRuleParameterProcessor);
	EstimateMainRuleParameterProcessor.$inject = ['$injector', 'estimateRuleParameterConstant', 'platformRuntimeDataService'];
	function EstimateMainRuleParameterProcessor($injector, estimateRuleParameterConstant, platformRuntimeDataService) {
		let service = {};

		service.processItem = function processItem(item) {
			let isReadOnly = !$injector.get('estimateMainRuleDataService').isProjectRuleSelected();
			service.setReadOnly(item, isReadOnly);

			let isLookupReadOnly = item.ValueType === estimateRuleParameterConstant.TextFormula || item.ValueType === estimateRuleParameterConstant.Boolean;
			let isValueDetailReadOnly = (item.IsLookup || item.DefaultValue === 0 || item.ValueType === estimateRuleParameterConstant.TextFormula || item.ValueType === estimateRuleParameterConstant.Boolean) ||
				((item.ValueType === estimateRuleParameterConstant.Decimal2 || item.ValueType === estimateRuleParameterConstant.TextFormula) && item.IsLookup);

			isValueDetailReadOnly = item.ValueType === estimateRuleParameterConstant.Text ? false : isValueDetailReadOnly;

			let readOnlyField = [{
				field: 'IsLookup',
				readonly: isLookupReadOnly
			},
			{
				field: 'ValueDetail',
				readonly: isValueDetailReadOnly
			}];

			platformRuntimeDataService.readonly(item, readOnlyField);
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