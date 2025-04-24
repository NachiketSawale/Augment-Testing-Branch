/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.project';


	angular.module(moduleName).controller('estimateProjectEstRuleParamValueListController',['$scope','platformGridControllerService','platformToolbarService',
		'estimateProjectEstRuleParamService','estimateProjectEstRuleParameterValueService', 'estimateProjectEstRuleParamValueConfigService', 'estimateProjectEstRuleParamValueValidationService',
		function ($scope,platformGridControllerService,platformToolbarService,
			estimateProjectEstRuleParamService,estimateProjectEstRuleParameterValueService, estimateProjectEstRuleParamValueConfigService, estimateProjectEstRuleParamValueValidationService) {

			let gridConfig = {
				initCalled: false,
				columns: [],
				grouping: true,
				cellChangeCallBack: function cellChangeCallBack(arg) {
					estimateProjectEstRuleParameterValueService.handleCellChanged(arg);
				}
			};

			platformGridControllerService.initListController($scope, estimateProjectEstRuleParamValueConfigService, estimateProjectEstRuleParameterValueService, estimateProjectEstRuleParamValueValidationService, gridConfig);

			let additionalTools = [
				{
					id: 'filterPrjRuleParameterValue',
					caption: 'estimate.rule.filterByParameter',
					type: 'check',
					value: estimateProjectEstRuleParameterValueService.getFilterStatus(),
					iconClass: 'tlb-icons ico-line-item-filter',
					fn: function () {
						estimateProjectEstRuleParameterValueService.setFilterStatus(this.value);
						estimateProjectEstRuleParameterValueService.hasToLoadOnFilterActiveChange(this.value);
						estimateProjectEstRuleParameterValueService.load();
					}
				}];

			_.forEach(additionalTools.reverse(), function(tool){
				$scope.tools.items.unshift(tool);
			});

			let tools = platformToolbarService.getTools($scope.getContainerUUID());
			// changeToolsStatus(true);

			function changeToolsStatus(disableTools) {
				_.forEach(tools, function (tool) {
					tool.disabled = disableTools;
				});
				$scope.tools.update();
			}

			function onIsLookupChanged(e, isLookup) {
				changeToolsStatus(!isLookup);
			}

			estimateProjectEstRuleParamService.parameterGetValueListComplete.register(getValueList);
			function getValueList(){
				if(estimateProjectEstRuleParameterValueService === null || estimateProjectEstRuleParameterValueService.getList().length === 0){
					return null;
				}
				return estimateProjectEstRuleParameterValueService.getList();
			}

			estimateProjectEstRuleParamService.parameterSetValueList.register(setValueList);
			function setValueList(){
				estimateProjectEstRuleParameterValueService.setList([]);
			}

			estimateProjectEstRuleParamService.deleteValuesComplete.register(deleteValues);
			function deleteValues(entities){
				if(entities) {
					estimateProjectEstRuleParameterValueService.deleteEntities(entities);
				}
			}

			estimateProjectEstRuleParamService.onIsLookupChangeEvent.register(onIsLookupChanged);
			// estimateProjectEstRuleParamService.onCodeChangeEvent.register(onCodeChanged);

			$scope.$on('$destroy', function () {
				estimateProjectEstRuleParamService.onIsLookupChangeEvent.unregister(onIsLookupChanged);
				// estimateProjectEstRuleParamService.onCodeChangeEvent.unregister(onCodeChanged);
				estimateProjectEstRuleParamService.parameterGetValueListComplete.unregister(getValueList);
				estimateProjectEstRuleParamService.parameterSetValueList.unregister(setValueList);
				estimateProjectEstRuleParamService.deleteValuesComplete.unregister(deleteValues);
				// estimateProjectEstRuleParameterValueService.onValueDetailChangeEvent.unregister(onValueDetailChangeEvent);
			});
		}]);

})();
