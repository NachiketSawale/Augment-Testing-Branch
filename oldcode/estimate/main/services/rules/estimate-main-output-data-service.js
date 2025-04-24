/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainOutputDataService
     * @function
     *
     * @description
     * Service for the estimate main rule script output container
     **/
	angular.module(moduleName).factory('estimateMainOutputDataService', ['$injector','$interval', '$http','$translate','platformGridAPI',
		'PlatformMessenger', 'platformDataServiceFactory','platformModalService','estimateMainService',
		function ($injector,$interval, $http,$translate,platformGridAPI, PlatformMessenger, platformDataServiceFactory,platformModalService,estimateMainService) {

			let showErrors = true,
				showWarnings = true,
				showInfos = true,
				autoRefreshFlag = false,
				showFilterByLineItems = false;

			let canStopProcedure = true,
				lastCount = 0,
				lastStatue = -1,
				logList = [],
				estRuleResultHeader = null;

			let ruleResultSearchCache = {};

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'estimateMainOutputDataService',
				entitySelection: {}
			};

			/**
             * use a interval to get the rule execution result of current estHeader per 3 second
             */

			function getEstHeaderIdSelected(){
				return estimateMainService.getSelectedEstHeaderId();
			}

			let stop;

			let container = platformDataServiceFactory.createNewComplete(serviceOption);

			let service = container.service;

			angular.extend(service, {
				getList: getList,
				setDataList: setDataList,
				showFilterByLineItem: showFilterByLineItem,
				showError: showError,
				showWarning: showWarning,
				showInfo: showInfo,
				getStatus: getStatus,
				updateSelection: updateSelection,
				startGetResultList : startGetResultList,
				stopGetRuleResult : stopGetRuleResult,
				stopProcedure : stopProcedure,
				getRuleResult :getRuleResult,
				getRuleResultHeader : getRuleResultHeader,
				reset: reset,
				estMainRuleOutputResultChanged: new PlatformMessenger(),
				ruleResultProgress : new PlatformMessenger()
			});

			return service;

			function reset(){
				canStopProcedure = true;
				lastCount = 0;
				logList = [];
				lastStatue = -1;
				estRuleResultHeader = null;
				container.data.itemList = [];
			}

			function getRuleResultHeader(){
				return estRuleResultHeader;
			}

			function stopGetRuleResult(){
				if(stop){
					$interval.cancel(stop);
					stop = undefined;
					enableBulkEditor();
				}
			}

			function getRuleResult(){

				let estHeaderId = getEstHeaderIdSelected();
				if(!estHeaderId){
					return;
				}

				if(Object.hasOwnProperty(estHeaderId) && ruleResultSearchCache[estHeaderId]){
					return ruleResultSearchCache[estHeaderId];
				}

				let executionInfo = {
					estHeaderId : estHeaderId,
					lastCount : lastCount
				};

				ruleResultSearchCache[estHeaderId] = $http.post(globals.webApiBaseUrl + 'estimate/ruleresult/list', executionInfo).then(function(response){
					let ruleExecutionResult = response.data;

					estRuleResultHeader = ruleExecutionResult.EstRuleResultHeader;
					addErrorInfo(ruleExecutionResult);
					service.ruleResultProgress.fire(ruleExecutionResult);

					/*
                     * if result header is not exist or result header is finished or result header is abort, then stop it
                     * */
					if(!ruleExecutionResult.EstRuleResultHeader){
						stopGetRuleResult();
					}
					else if(ruleExecutionResult.EstRuleResultHeader.ExecutionState === 1){
						setList([]);
					}else if([2,3,4].indexOf(ruleExecutionResult.EstRuleResultHeader.ExecutionState) > -1)
					{
						stopGetRuleResult();
						if(ruleExecutionResult.EstRuleResultHeader.ExecutionState === 2 && (lastStatue !== -1 || autoRefreshFlag)){

							// refresh the lineItem container
							let lastSelected = angular.copy(estimateMainService.getSelected());
							// estimateMainService.fireListLoaded();
							estimateMainService.refresh().then(function(){
								if(lastSelected){
									let lineItemSelected = _.find(estimateMainService.getList(), { Id : lastSelected.Id});
									estimateMainService.updateItemSelection(lineItemSelected);
								}
							});
							// refresh the boq container
							estimateMainService.onBoqItesmUpdated.fire();
						}

						autoRefreshFlag = false;
					}

					if(ruleExecutionResult.EstRuleResultHeader){
						lastStatue = ruleExecutionResult.EstRuleResultHeader.ExecutionState;
					}
					if(ruleResultSearchCache[estHeaderId]){
						ruleResultSearchCache[estHeaderId] = null;
					}
				}, function(){
					stopGetRuleResult();
					if(ruleResultSearchCache[estHeaderId]){
						ruleResultSearchCache[estHeaderId] = null;
					}
				});
			}

			function startGetResultList(autoRefresh){
				reset();
				autoRefreshFlag = autoRefresh;
				canStopProcedure = true;
				let estHeaderId = estimateMainService.getSelectedEstHeaderId();
				if(estHeaderId && !stop){
					logList = [];
					lastCount = 0;
					stop = $interval(getRuleResult, 5000, 1000, false, false);
				}
			}

			function enableBulkEditor(){

				let estLineItemGridId = '681223e37d524ce0b9bfa2294e18d650';
				if (platformGridAPI.grids.exist(estLineItemGridId)){
					let lineItemGrid = platformGridAPI.grids.element('id', estLineItemGridId);
					if(lineItemGrid){
						let lineItemTools = $injector.get('platformToolbarService').getTools(estLineItemGridId);
						_.forEach(lineItemTools, function (btn) {
							if (btn.id === 't14') {
								btn.disabled = false;
							}
						});
						lineItemGrid.scope.$parent.addTools(lineItemTools);
					}
				}

				let estResourceGridId = 'bedd392f0e2a44c8a294df34b1f9ce44';
				if (platformGridAPI.grids.exist(estResourceGridId)){
					let estResourceGrid = platformGridAPI.grids.element('id', estResourceGridId);
					if(estResourceGrid){
						let resourceTools = $injector.get('platformToolbarService').getTools(estResourceGridId);
						_.forEach(resourceTools, function (btn) {
							if (btn.id === 't14') {
								btn.disabled = false;
							}
						});
						estResourceGrid.scope.$parent.addTools(resourceTools);
					}
				}
			}

			function addErrorInfo(ruleExecutionResult){
				let errorInfos = ruleExecutionResult.EstRuleResultViews;

				if(!errorInfos) {
					return;
				}

				_.forEach(errorInfos, function(item){
					let errorItem = {};
					errorItem.Id = item.Id;
					errorItem.lineItemCode = item.LineItemCode;
					errorItem.AssignedStructureType = item.ElementType;
					errorItem.ElementCode = item.ElementCode;
					errorItem.RuleId = item.RuleId;
					errorItem.ruleCode = item.RuleCode;
					errorItem.ErrorType = item.ErrorType;
					errorItem.Description = item.Description;
					errorItem.Line = item.CurrentLine;
					errorItem.Column = item.CurrentColumn;
					errorItem.CallStack = item.CallStack;

					logList.push(errorItem);
				});

				logList = _.uniqBy(logList, 'Id');

				lastCount = logList.length;

				ruleExecutionResult.EstRuleResultViews = logList;

				setList(logList);
			}

			function setList(values){
				container.data.itemList = values;

				service.estMainRuleOutputResultChanged.fire();
			}

			function stopProcedure(){
				let estHeaderId = estimateMainService.getSelectedEstHeaderId();
				if(estHeaderId && canStopProcedure){
					$http.get(globals.webApiBaseUrl + 'estimate/ruleresult/stopprocedure?estHeaderId='+ estHeaderId).then(function(){
						canStopProcedure = false;
					});
				}
			}

			function getList() {
				let dataToFilter = angular.copy(container.data.itemList);
				if (showFilterByLineItems){
					dataToFilter = getDataFilteredByLineItem(dataToFilter);
				}
				return getFilteredData(dataToFilter);
			}

			function setDataList(data) {
				data = data || [];
				container.data.itemList = getCompleteDataFromRuleExecution(data);
			}

			function showError(value) {
				showErrors = value;
			}

			function showWarning(value) {
				showWarnings = value;
			}

			function showInfo(value) {
				showInfos = value;
			}

			function showFilterByLineItem(value){
				showFilterByLineItems = value;
			}

			function getStatus(){
				return {
					showFilterByLineItems: showFilterByLineItems,
					showErrors: showErrors,
					showWarnings: showWarnings,
					showInfos: showInfos
				};
			}

			function updateSelection(item){
				let selectedItem = item || service.getSelected();
				if (selectedItem){
					let itemToSelect = service.getItemById(selectedItem.Id);
					service.setSelected(itemToSelect);
				}
			}

			function getDataFilteredByLineItem(data){
				let selectedLineItems = estimateMainService.getSelectedEntities();
				if (selectedLineItems === null || _.size(selectedLineItems) === 0){
					return data;
				}
				let selectedLineItemsCode = _.map(selectedLineItems, 'Code');
				return data.filter(function (item) {
					return selectedLineItemsCode.indexOf(item.lineItemCode) !== -1;
				});
			}

			function getCompleteDataFromRuleExecution(result) {
				let resultList = [];

				if (angular.isArray(result)) {
					result.forEach(function (item) {
						if (item.ScriptErrorList) {
							item.ScriptErrorList.forEach(function (resultItem) {
								if (resultItem) {
									let errorItem = {};
									errorItem.lineItemCode = item.LineItemCode;
									errorItem.AssignedStructureType = item.AssignedStructureType;
									errorItem.ElementCode = item.ElementCode;
									errorItem.RuleId = item.RuleId;
									errorItem.ruleCode = item.RuleCode;
									errorItem.ErrorType = resultItem.ErrorType;
									errorItem.Description = resultItem.Description;
									errorItem.Line = resultItem.Line;
									errorItem.Column = resultItem.Column;
									errorItem.CallStack = resultItem.CallStack;
									resultList.push(errorItem);
								}
							});
						}
					});
				}

				// if has result which errorType == 1(error), then just show the error result
				let errorList = _.filter(resultList, {ErrorType : 1});

				if(angular.isDefined(errorList) && errorList !== null && errorList.length > 0){
					resultList = errorList;
				}

				angular.forEach(resultList, function (item, index) {
					item.Id = index + 1;
				});

				return resultList;
			}

			function getFilteredData(data) {
				data = data || [];

				let errorTypes = [];

				if (showErrors) {
					errorTypes.push(1);
					errorTypes.push(5);
				}
				if (showWarnings) {
					errorTypes.push(2);
				}
				if (showInfos) {
					errorTypes.push(3);
				}

				data = data.filter(function (item) {
					return errorTypes.indexOf(item.ErrorType) !== -1;
				});

				data = _.sortBy(data, 'Id');

				angular.forEach(data, function (item, index) {
					item.Order = index + 1;
				});

				return data;
			}
		}
	]);

})(angular);
