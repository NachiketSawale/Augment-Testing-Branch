/**
 * Created by luy on 6/8/2017.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainCommonCopyAssemblyTemplateRuleService', [
		'_', '$http', '$q', '$injector', 'estimateMainRuleUpdateService', 'estimateRuleProcessor',
		'estimateParamUpdateService', 'estimateParameterProcessor','estimateRuleParameterConstant', 'estimateRuleAssignmentService',
		function (_, $http, $q, $injector, estimateMainRuleUpdateService, estimateRuleProcessor,
			estimateParamUpdateService, estimateParameterProcessor,estimateRuleParameterConstant, estimateRuleAssignmentService) {
			let service = {};
			let isAbort = false;
			let isClearParamFormatter = false;

			// region - rules
			function getProjectEstimateRules(){
				let estimateRuleComplexLookupService = $injector.get('estimateRuleComplexLookupService');
				return estimateRuleComplexLookupService.getList();
			}

			function filterAssignedRule(sourceRule, projectEstimateRules, assignedRules){
				for(let i = 0; i < projectEstimateRules.length; ++i){
					if(isAbort) {
						break;
					}

					if(projectEstimateRules[i].MainId === sourceRule.EstRuleFk){
						let assignedRule = angular.copy(projectEstimateRules[i]);
						estimateRuleAssignmentService.updateProperties(assignedRule, sourceRule);
						assignedRule.IsExecution = false;// TODO-Walt:the default value is false
						assignedRules.push(assignedRule);
						isAbort = true;
						break;
					}
					else if(projectEstimateRules[i].CustomEstRules && projectEstimateRules[i].CustomEstRules.length > 0){
						filterAssignedRule(sourceRule, projectEstimateRules[i].CustomEstRules, assignedRules);
					}
				}
			}

			function filterAssignedRules(sourceRules, projectEstimateRules){
				let assignedRules = [];
				if(sourceRules === null || !_.isArray(sourceRules) ||
                    projectEstimateRules === null || !_.isArray(projectEstimateRules)) {
					return assignedRules;
				}

				for(let i = 0; i < sourceRules.length; ++i){
					isAbort = false;
					filterAssignedRule(sourceRules[i], projectEstimateRules, assignedRules);
				}
				return assignedRules;
			}

			function filterRulesFromProjectEstimateRules(mainEntity, ruleRelationService){
				if(mainEntity === undefined || mainEntity === null) {
					return null;
				}

				let sourceRules = ruleRelationService.getDataList(mainEntity);
				let projectEstimateRules = getProjectEstimateRules();
				return filterAssignedRules(sourceRules, projectEstimateRules);
			}

			function assignEstRulesToItem(sourceItems, destItem, itemService, isAssemblyToWic, overwrite){
				let promisArray = [];
				if(undefined === destItem.RuleAssignment)
				{
					let serviceName = itemService.getServiceName();
					let itemName    =  itemService.getItemName();

					let formaterService = $injector.get('estimateRuleFormatterService');
					if('estimateMainService' === serviceName && 'EstLineItems' === itemName)
					{
						let optionEstLine = {
							dataServiceMethod:'getItemByRuleAsync',
							dataServiceName:'estimateRuleFormatterService',
							itemName:'EstLineItems',
							itemServiceName:'estimateMainService',
							serviceName:'basicsCustomizeRuleIconService',
							validItemName:'EstLineItems'
						};

						promisArray.push(formaterService.getItemByRuleAsync(destItem,optionEstLine));
					}
					else if('estimateMainAssembliesCategoryService' === serviceName && 'EstAssemblyCat' === itemName)
					{
						let optionCatgory = {
							RootServices: undefined,
							dataServiceMethod: 'getItemByRuleAsync',
							dataServiceName: 'estimateRuleFormatterService',
							itemName: 'EstAssemblyCat',
							itemServiceName: 'estimateMainAssembliesCategoryService',
							serviceName: 'basicsCustomizeRuleIconService',
							validItemName: 'EstAssemblyCat'
						};
						promisArray.push(formaterService.getItemByRuleAsync(destItem,optionCatgory));
					}
				}
				$q.all(promisArray).then(function (){
					estimateMainRuleUpdateService.setRuleToSave(sourceItems, destItem, itemService.getServiceName(), itemService.getItemName(), isAssemblyToWic, overwrite);
					estimateRuleProcessor.assignRules(sourceItems, destItem);
					itemService.fireItemModified(destItem);
				});
			}
			// end region - rules

			// region - parameters
			function copyAssemblyParameter(sourceParameter, creationData, newParameter){
				if(newParameter === undefined) {
					return;
				}

				newParameter.MainId = newParameter.Id;
				newParameter.AssignedStructureId = sourceParameter.AssignedStructureId;
				newParameter.BoqHeaderFk = sourceParameter.BoqHeaderFk;
				newParameter.Code = sourceParameter.Code;
				newParameter.DescriptionInfo = sourceParameter.DescriptionInfo;
				newParameter.EstHeaderFk = creationData.EstHeaderFk;
				newParameter.EstParameterGroupFk = sourceParameter.EstParameterGroupFk;
				newParameter.HasCalculated = sourceParameter.HasCalculated;
				newParameter.ParamAssignedItemFk = sourceParameter.ParamAssignedItemFk;
				newParameter.Sorting = sourceParameter.Sorting;
				newParameter.UomFk = sourceParameter.UomFk;
				newParameter.ValueDetail = sourceParameter.ValueDetail;
				newParameter.IsLookup = sourceParameter.IsLookup ? 1:0;
				newParameter.ValueType = sourceParameter.ValueType;

				if(sourceParameter.ValueType === estimateRuleParameterConstant.Boolean){
					newParameter.ParameterValue = sourceParameter.ParameterValue ? 1:0;
					newParameter.DefaultValue = sourceParameter.DefaultValue ? 1:0;
				}else {
					newParameter.DefaultValue = sourceParameter.DefaultValue;
					newParameter.ParameterValue = sourceParameter.ParameterValue;
				}

				newParameter.EstRuleParamValueFk = sourceParameter.EstRuleParamValueFk;

				if(creationData.itemName === 'EstAssemblyCat'){
					newParameter.EstAssemblyCatFk = creationData.item.Id;
				}
				else if(creationData.itemName === 'EstLineItems'){
					newParameter.EstLineItemFk = creationData.item.Id;
				}

				if(newParameter.DescriptionInfo && newParameter.DescriptionInfo.Translated === null){
					newParameter.DescriptionInfo.Translated = newParameter.DescriptionInfo.Description;
				}
			}

			function assignParameterFromProjectEstimateRules(sourceParams, creationData, itemService, destParams) {
				let assignedParams = [];
				let assignedAssemblyParams = [];
				let isExist = false;
				let promises = [];

				for (let i = 0; i < sourceParams.length; ++i) {
					isExist = false;
					for (let j = 0; j < destParams.length; ++j) {
						if (sourceParams[i].Code === destParams[j].Code &&
                            sourceParams[i].ValueType === destParams[j].ValueType) {
							isExist = true;
							break;
						}
					}

					if (!isExist) {
						assignedAssemblyParams.push(sourceParams[i]);
						promises.push($http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/create', creationData));
					}
				}

				return $q.all(promises).then(function () {
					let itemName = creationData.itemName + 'Param';
					let destEntity = creationData.item;
					for (let i = 0; i < assignedAssemblyParams.length; ++i) {
						let newParam = promises[i].$$state.value.data[itemName];
						if (newParam === undefined) {
							continue;
						}
						copyAssemblyParameter(assignedAssemblyParams[i], destEntity, newParam);
						assignedParams.push(newParam);
					}

					if (assignedParams.length > 0) {
						isClearParamFormatter = true;
						let paramFormatterServ = $injector.get('estimateParameterFormatterService');
						paramFormatterServ.isRestoreParam(true);
						estimateParamUpdateService.setParamToSave(assignedParams, destEntity, itemService.getServiceName(), itemService.getItemName());
						estimateParameterProcessor.assignParameters(assignedParams, destEntity);
						itemService.fireItemModified(destEntity);
					}
				});
			}

			function getParametersOfProjectRules(projectRuleIds){
				let paramPromise = $q.when(false);
				if(projectRuleIds.length > 0){
					paramPromise =  $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/getParamsOfMultiRules', projectRuleIds);
				}

				return paramPromise;
			}

			function getParametersOfMasterRules(masterRuleIds){
				let paramPromise = $q.when(false);
				if(masterRuleIds.length > 0){
					paramPromise =  $http.post(globals.webApiBaseUrl + 'estimate/rule/parameter/getParamsOfMultiRules', masterRuleIds);
				}

				return paramPromise;
			}

			function getParameters(projectRuleIds, masterRuleIds){
				let paramPromises = [];
				paramPromises.push(getParametersOfProjectRules(projectRuleIds));
				paramPromises.push(getParametersOfMasterRules(masterRuleIds));

				return $q.all(paramPromises).then(function(){
					let params = [];
					for(let i = 0; i < paramPromises.length; ++i){
						if(_.isArray(paramPromises[i].$$state.value.data)){
							params = params.concat(paramPromises[i].$$state.value.data);
						}
					}
					return $q.when(params);
				});
			}

			function getParametersOfRules(assignedRules, projectFk){
				let ruleCodes = [];
				let projectRuleIds = [];
				let masterRuleIds = [];
				for(let i = 0; i < assignedRules.length; ++i){
					ruleCodes.push(assignedRules[i].Code);
					masterRuleIds.push(assignedRules[i].MainId);
				}

				if(projectFk === -1){
					return getParameters(projectRuleIds, masterRuleIds);
				}else{
					return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/filterPrjEstRules' + '?projectFK=' + projectFk, ruleCodes).then(function(response){
						let projectRules = response.data;
						if(_.isArray(projectRules)) {
							for (let i = 0; i < projectRules.length; ++i) {
								projectRuleIds.push(projectRules[i].Id);
								for (let j = 0; j < ruleCodes.length; ++j) {
									if (ruleCodes[j] === projectRules[i].Code) {
										ruleCodes.splice(j, 1);
										masterRuleIds.splice(j, 1);
									}
								}
							}
						}

						return getParameters(projectRuleIds, masterRuleIds);
					});
				}
			}

			function mergeParameters(assemblyParams, prjRuleParams){
				let mergedParams = assemblyParams;
				if(!_.isArray(mergedParams)){
					mergedParams = prjRuleParams;
				}
				else if(_.isArray(prjRuleParams)){
					let bExist = false;
					let tempParams = [];
					for(let j = 0; j < prjRuleParams.length; ++j){
						bExist = false;
						for(let i = 0; i < mergedParams.length; ++i){
							if(mergedParams[i].Code === prjRuleParams[j].Code &&
                                mergedParams[i].ValueType === prjRuleParams[j].ValueType){
								bExist = true;
								break;
							}
						}
						if(!bExist){
							tempParams.push(prjRuleParams[j]);
						}
					}
					mergedParams = mergedParams.concat(tempParams);
				}

				return mergedParams;
			}
			// end region - parameters

			function isClearParameterFormatter(){
				return isClearParamFormatter;
			}

			function resetClearParameterFormatter(){
				isClearParamFormatter = false;
			}

			angular.extend(service, {
				filterRulesFromProjectEstimateRules: filterRulesFromProjectEstimateRules,
				assignEstRulesToItem: assignEstRulesToItem,
				assignParameterFromProjectEstimateRules: assignParameterFromProjectEstimateRules,
				getParametersOfRules: getParametersOfRules,
				mergeParameters: mergeParameters,
				isClearParameterFormatter: isClearParameterFormatter,
				resetClearParameterFormatter: resetClearParameterFormatter
			});

			return service;
		}
	]);

})(angular);
