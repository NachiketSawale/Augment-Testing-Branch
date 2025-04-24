/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	const moduleName = 'estimate.project';

	/**
	 * @ngdoc Factory
	 * @name
	 * * estimateProjectEstRuleParameterValueControllerFactory
	 * @function
	 *
	 * @description
	 * Controller factory for the list view of any kind of entity causing a change in the Estimate rules parameter value
	 **/

	angular.module(moduleName).factory('estimateProjectEstRuleParameterValueControllerFactory',['$injector', 'platformGridControllerService','platformToolbarService',

		function ($injector, platformGridControllerService, platformToolbarService) {
			function initRuleParameterValueListController(options){
				if (!options){
					return;
				}
				let scope = options.scope,
					gridConfig = {initCalled: false, columns: [], grouping: true};

				if(options.gridConfig){
					angular.extend(gridConfig, options.gridConfig);
				}

				let dataValidationservice =  options.dataValidationService,
					dataService = options.dataService,
					configService = options.dataConfigService,
					parentRuleParamService = options.parentService,
					ruleDataService = options.ruleDataService;

				platformGridControllerService.initListController(scope, configService, dataService, dataValidationservice, gridConfig);

				let additionalTools = [
					{
						id: 'filterPrjRuleParameterValue',
						caption: 'estimate.rule.filterByParameter',
						type: 'check',
						value: dataService.getFilterStatus(),
						iconClass: 'tlb-icons ico-line-item-filter',
						fn: function () {
							dataService.setFilterStatus(this.value);
							dataService.hasToLoadOnFilterActiveChange(this.value);
							parentRuleParamService.deselect();
							parentRuleParamService.refreshItem();
							dataService.loadByFilter(true);
						}
					}];

				_.forEach(additionalTools.reverse(), function(tool){
					scope.tools.items.unshift(tool);
				});

				let tools = platformToolbarService.getTools(scope.getContainerUUID());

				function changeToolsStatus(disableTools) {
					_.forEach(tools, function (tool) {
						tool.disabled = disableTools;
					});
					scope.tools.update();
				}

				function onIsLookupChanged(e, isLookup) {
					changeToolsStatus(!isLookup);
				}

				function loadBySelection(){
					parentRuleParamService.deselect();
					dataService.loadByFilter(false);
				}

				ruleDataService.registerSelectionChanged(loadBySelection);

				parentRuleParamService.onIsLookupChangeEvent.register(onIsLookupChanged);

				scope.$on('$destroy', function () {
					parentRuleParamService.onIsLookupChangeEvent.unregister(onIsLookupChanged);
					ruleDataService.unregisterSelectionChanged(loadBySelection);
				});
			}

			return {
				initRuleParameterValueListController: initRuleParameterValueListController
			};
		}]);
})();
