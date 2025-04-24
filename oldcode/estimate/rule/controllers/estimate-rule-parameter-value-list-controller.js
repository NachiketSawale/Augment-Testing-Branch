/**
 * Created by spr on 2017-04-26.
 */

/* global _ */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';

	angular.module(moduleName).controller('estimateRuleParameterValueListController', ['_', '$scope', 'platformGridControllerService', 'platformGridAPI', 'platformToolbarService', 'estimateRuleParameterValueService', 'estimateRuleParameterValueConfigurationService', 'estimateRuleParamValueValidationService', 'estimateRuleParameterService','estimateRuleParameterConstant',
		function (_, $scope, platformGridControllerService, platformGridAPI, platformToolbarService, estimateRuleParameterValueService, estimateRuleParameterValueConfigurationService, estimateRuleParamValueValidationService, estimateRuleParameterService,estimateRuleParameterConstant) {

			let myGridConfig = {
				cellChangeCallBack: function cellChangeCallBack(arg) {
					let ruleParamSelectItem = estimateRuleParameterService.getSelected();
					let col = arg.grid.getColumns()[arg.cell].field;
					let curItem = arg.item;

					if(col === 'ValueDetail') {
						if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
							ruleParamSelectItem.ValueDetail = curItem.ValueDetail;
							ruleParamSelectItem.ActualValue = curItem.Value;
							estimateRuleParameterService.markItemAsModified(ruleParamSelectItem);
							estimateRuleParameterService.gridRefresh();
						}
					}

					if(col==='Description'){
						if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
							estimateRuleParameterService.gridRefresh();  // Refresh the grid to show the default value change
						}
					}

					if(col === 'Value'){
						if (curItem.Id === ruleParamSelectItem.EstRuleParamValueFk) {
							ruleParamSelectItem.ValueDetail = curItem.Value;
							ruleParamSelectItem.ActualValue = curItem.Value;
							estimateRuleParameterService.markItemAsModified(ruleParamSelectItem);
							estimateRuleParameterService.gridRefresh();
						}
					}

					if(col === 'IsDefault')
					{
						if(curItem.IsDefault){
							ruleParamSelectItem.ValueDetail = curItem.ValueDetail;
							ruleParamSelectItem.DefaultValue = curItem.Id;
							ruleParamSelectItem.EstRuleParamValueFk = curItem.Id;
							ruleParamSelectItem.ActualValue = curItem.Value;

							if(ruleParamSelectItem.ValueType === estimateRuleParameterConstant.TextFormula){
								ruleParamSelectItem.ValueText = curItem.DescriptionInfo.Translated;
							}else if(ruleParamSelectItem.ValueType === estimateRuleParameterConstant.Text){
								ruleParamSelectItem.ValueText =  curItem.ValueText;
							}else{
								ruleParamSelectItem.ParameterValue = curItem.Value;
							}

						}else{
							ruleParamSelectItem.ValueDetail = null;
							ruleParamSelectItem.DefaultValue = null;
							ruleParamSelectItem.EstRuleParamValueFk = null;
							ruleParamSelectItem.ActualValue = null;
						}

						estimateRuleParameterService.markItemAsModified(ruleParamSelectItem);
						estimateRuleParameterService.gridRefresh();
					}
				}
			};

			platformGridControllerService.initListController($scope, estimateRuleParameterValueConfigurationService, estimateRuleParameterValueService, estimateRuleParamValueValidationService, myGridConfig);

			let additionalTools = [
				{
					id: 'filterRuleParameterValue',
					caption: 'estimate.rule.filterByParameter',
					type: 'check',
					value: estimateRuleParameterValueService.getFilterStatus(),
					iconClass: 'tlb-icons ico-line-item-filter',
					fn: function () {
						estimateRuleParameterValueService.setFilterStatus(this.value);
						estimateRuleParameterValueService.hasToLoadOnFilterActiveChange(this.value);
						estimateRuleParameterValueService.load();
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

			function onIsLookupChanged (e, isLookup) {
				changeToolsStatus(!isLookup);
			}

			estimateRuleParameterService.parameterGetValueListComplete.register(getValueList);
			function getValueList(){
				if(estimateRuleParameterValueService === null || estimateRuleParameterValueService.getList().length === 0){
					return null;
				}
				return estimateRuleParameterValueService.getList();
			}

			estimateRuleParameterService.parameterSetValueList.register(setValueList);
			function setValueList(){
				estimateRuleParameterValueService.setList([]);
			}

			estimateRuleParameterService.deleteValuesComplete.register(deleteValues);
			function deleteValues(entities){
				if(entities && entities!== null) {
					estimateRuleParameterValueService.deleteEntities(entities);
				}
			}

			estimateRuleParameterService.onIsLookupChangeEvent.register(onIsLookupChanged);

			$scope.$on('$destroy', function () {
				estimateRuleParameterService.onIsLookupChangeEvent.unregister(onIsLookupChanged);
				// estimateRuleParameterService.onCodeChangeEvent.unregister(onCodeChanged);
				estimateRuleParameterService.parameterGetValueListComplete.unregister(getValueList);
				estimateRuleParameterService.parameterSetValueList.unregister(setValueList);
				estimateRuleParameterService.deleteValuesComplete.unregister(deleteValues);
			});

		}]);
})(angular, _);

