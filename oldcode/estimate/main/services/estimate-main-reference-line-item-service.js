/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainRefLineItemService
	 * @function
	 *
	 * @description
	 * estimateMainRefLineItemService is the data service to assign reference line item.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainRefLineItemService', ['$http', '$q', '$translate', '$injector', 'estimateMainResourceService',
		'estimateMainService', 'cloudCommonGridService', 'estimateMainCommonCalculationService', 'estimateMainResourceImageProcessor',
		'estimateMainResourceProcessor', 'estimateMainCommonService','estimateMainDynamicColumnService', 'estimateMainLineItemProcessor',
		'estimateMainRuleUpdateService','estimateRuleFormatterService','estimateParameterFormatterService',
		function (
			$http, $q, $translate, $injector, estimateMainResourceService,
			estimateMainService, cloudCommonGridService, estimateMainCommonCalculationService, estimateMainResourceImageProcessor,
			estimateMainResourceProcessor, estimateMainCommonService,estimateMainDynamicColumnService, estimateMainLineItemProcessor,
			estimateMainRuleUpdateService, estimateRuleFormatterService, estimateParameterFormatterService) {

			let service = {};

			let selectedLineItemId,
				resourcesOfSelectedLineItem = [];

			let refreshItems = function refreshItems() {
				estimateMainResourceService.gridRefresh();
				estimateMainService.gridRefresh();
			};

			let replaceRefItem = function replaceRefItem(item, baseItem){
				let numPropsToCopy = ['EstAssemblyCatFk',
						'EstAssemblyFk',
						'BasUomTargetFk',
						'BasUomFk',
						'EstCostRiskFk',
						'BoqRootRef',
						'BoqItemFk',
						'BoqHeaderFk',
						'PsdActivitySchedule',
						'PsdActivityFk',
						'LicCostGroup1Fk',
						'LicCostGroup2Fk',
						'LicCostGroup3Fk',
						'LicCostGroup4Fk',
						'LicCostGroup5Fk',
						'MdcControllingUnitFk',
						'PrjCostGroup1Fk',
						'PrjCostGroup2Fk',
						'PrjCostGroup3Fk',
						'PrjCostGroup4Fk',
						'PrjCostGroup5Fk',
						'MdcWorkCategoryFk',
						'MdcAssetMasterFk',
						'PrjLocationFk',
						'PrcStructureFk',
						'PrjChangeFk',
						'SortCode01Fk',
						'SortCode02Fk',
						'SortCode03Fk',
						'SortCode04Fk',
						'SortCode05Fk',
						'SortCode06Fk',
						'SortCode07Fk',
						'SortCode08Fk',
						'SortCode09Fk',
						'SortCode10Fk'],
					strPropsToCopy = [
						'DescriptionInfo',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'CommentText' ];

				_.forEach(strPropsToCopy, function(prop) {
					if(prop === 'DescriptionInfo'){
						if(!item.DescriptionInfo.Translated){
							item.DescriptionInfo.Translated = baseItem.DescriptionInfo.Description;
							item.DescriptionInfo.Description = baseItem.DescriptionInfo.Description;
							item.DescriptionInfo.Modified = true;
						}
					}else{
						if(_.isEmpty(item[prop])){
							item[prop] = baseItem[prop];
						}
					}
				});

				_.forEach(numPropsToCopy, function(prop) {
					if(item[prop] <= 0){
						item[prop] = baseItem[prop];
					}
				});
			};

			service.getResources = function(lineItemId){
				if(selectedLineItemId === lineItemId){
					return resourcesOfSelectedLineItem;
				}

				return [];
			};

			service.getRefBaseResources = function getRefBaseResources(item, isBaseCopyReq, skipCheckLineItem){
				skipCheckLineItem = !!skipCheckLineItem;
				let data = {
					'estHeaderFk':item.EstHeaderFk,
					'estLineItemFk':item.Id,
					'estBaseLineItemFk': item.EstLineItemFk,
					'projectId' : estimateMainService.getSelectedProjectId(),
					'skipCheckLineItem' : skipCheckLineItem
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getbaselineitem', data).then(function (response) {
					let result = response.data;

					selectedLineItemId = item.Id;
					resourcesOfSelectedLineItem = result.EstBaseResources ? _.filter(result.EstBaseResources, function(item){return item.EstResourceFk === null;}) : [];

					let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
					if(result && result.EstBaseItemUserDefinedColVal){
						estimateMainDynamicUserDefinedColumnService.resolveRefLineitem(item, result.EstBaseItemUserDefinedColVal);
					}

					if(!skipCheckLineItem){
						let userDefinedColumnTableIds = $injector.get('userDefinedColumnTableIds');
						let updatedComplete = {
							UserDefinedColumnValueToDelete : [{
								'TableId':userDefinedColumnTableIds.EstimateLineItem,
								'Pk1':item.EstHeaderFk,
								'Pk2': item.Id
							}]
						};
						estimateMainDynamicUserDefinedColumnService.handleUpdateDone(updatedComplete);
					}

					if(result && result.ResourceUserDefinedColVal && result.ResourceUserDefinedColVal.length > 0  && result.EstBaseResources && result.EstBaseResources.length > 0){
						let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
						estimateMainResourceDynamicUserDefinedColumnService.resolveRefResource(resourcesOfSelectedLineItem, result.ResourceUserDefinedColVal);
					}

					if(result.EstBaseItem && result.EstBaseItem.Id){

						let baseItem = result.EstBaseItem;
						if(isBaseCopyReq){
							replaceRefItem(item, baseItem);
						}

						estimateMainResourceService.clearModifications();
						if(result.EstBaseResources && result.EstBaseResources.length >0){
							item.EstResources = [];
						}
						return resourcesOfSelectedLineItem;
					}
					else{
						return $q.when([]);
					}
				}
				);
			};

			service.getResourceCopy = function getResourceCopy(item,EstLineItemFk,isBaseCopyReq){
				let data = {
					'estHeaderFk':item.EstHeaderFk,
					'estLineItemFk':item.Id,
					'estBaseLineItemFk': EstLineItemFk,
					'projectId' : estimateMainService.getSelectedProjectId()
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/copyresource', data
				).then(function (response) {
					// item.estLineItemFk = null;
					let result = response.data;

					if(result.EstBaseItem && result.EstBaseItem.Id){

						// TODO-Walt:Copy the param, rule from the base lineItem
						// Add the rule
						if(result.EstLineItem2EstRule){
							estimateRuleFormatterService.processData(result.EstLineItem2EstRule);
							estimateRuleFormatterService.addRules('EstLineItems', 'EstLineItemFk', result.EstLineItem2EstRule);

							item.Rule = _.uniq(_.map(result.EstLineItem2EstRule,'Code'));
							item.RuleAssignment = _.map(result.EstLineItem2EstRule, function(item){ return angular.copy(item);});
							if(!!item.RuleAssignment && item.RuleAssignment.length > 0){
								_.forEach(item.RuleAssignment, function (item) {
									item.MainId = item.PrjEstRuleFk;
								});
							}
							estimateMainService.fireItemModified(item);
						}

						if(result.EstLineItemParam){
							estimateParameterFormatterService.processData(result.EstLineItemParam);
							estimateParameterFormatterService.addLineItemParam('EstLineItems', 'EstLineItemFk', result.EstLineItemParam);
						}

						let baseItem = result.EstBaseItem,
							resList = [];
						if(isBaseCopyReq){
							replaceRefItem(item, baseItem);
						}

						// Clean the deleted UDP cache
						let userDefinedColumnTableIds = $injector.get('userDefinedColumnTableIds');
						let updatedComplete = {
							UserDefinedColumnValueToDelete : [{
								'TableId':userDefinedColumnTableIds.EstimateLineItem,
								'Pk1':item.EstHeaderFk,
								'Pk2': item.Id
							}]
						};
						let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
						estimateMainDynamicUserDefinedColumnService.handleUpdateDone(updatedComplete);

						if(result && result.EstBaseItemUserDefinedColVal){
							estimateMainDynamicUserDefinedColumnService.resolveRefLineitem(item, result.EstBaseItemUserDefinedColVal);
							estimateMainDynamicUserDefinedColumnService.updateValueList([result.EstBaseItemUserDefinedColVal]);
						}

						estimateMainResourceService.clearModifications();
						if(result.EstBaseResources && result.EstBaseResources.length >0){
							if(result && result.ResourceUserDefinedColVal && result.ResourceUserDefinedColVal.length > 0){
								let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
								estimateMainResourceDynamicUserDefinedColumnService.resolveRefResource(result.EstBaseResources, result.ResourceUserDefinedColVal);
								estimateMainResourceDynamicUserDefinedColumnService.updateValueList(result.ResourceUserDefinedColVal);
							}

							resList = result.EstBaseResources;
							resList = _.filter(resList, function(item){
								return item.EstResourceFk === null;
							});
							item.EstResources = resList;
							estimateMainResourceService.updateList(resList, false);
							// estimateMainResourceService.restoreGridConfig();
							// estimateMainResourceService.setList(resList, false);
							// estimateMainResourceService.fireListLoaded();
							item.EstResources = [];
						}
						return result.EstBaseResources;
					}
					else{
						$q.when([]);
					}

				}
				);
			};

			service.setRefLineItem = function setRefLineItem (arg){
				let item =arg;
				if(item.EstLineItemFk > 0){

					estimateMainDynamicColumnService.setLineItemReadOnly(arg,true);
					return service.getRefBaseResources(item, true).then(function(resList){

						/* calculate quantity and cost of lineItem and resources */
						estimateMainCommonService.calculateLineItemAndResources(item, resList);

						// clear the param , rule
						estimateRuleFormatterService.removeRules('EstLineItems', 'EstLineItemFk', item.Id);
						estimateParameterFormatterService.removeLineItemParam('EstLineItems', 'EstLineItemFk', item.Id);
						item.Param = [];
						item.Rule = [];
						item.RuleAssignment = [];
						estimateMainService.fireItemModified(item);

						estimateMainResourceService.updateList(resList, true);
						estimateMainLineItemProcessor.processItem(item);

						return estimateMainService.gridRefresh();
					});
				}else{
					estimateMainDynamicColumnService.setLineItemReadOnly(arg,false);
					let itemCount = estimateMainResourceService.getList();
					estimateMainResourceService.setList([], true);
					if(itemCount && itemCount.length > 0){
						if(itemCount[0].EstLineItemFk > 0 && itemCount[0].EstLineItemFk!== item.Id){
							return service.getResourceCopy(item,itemCount[0].EstLineItemFk,false).then(
								function(result){

									/* calculate quantity and cost of lineItem and resources */
									estimateMainCommonService.calculateLineItemAndResources(item, result);

									estimateMainLineItemProcessor.setRuleReadonly(item, false);
									return refreshItems();
								}
							);
						}else{
							return $q.when();
						}
					}else{
						return $q.when();
					}
				}
			};

			service.getResourcesByRefLineitem = function getResourcesByRefLineitem(refItem, skipCheckLineItem){
				if(!refItem){
					return $q.when([]);
				}
				return service.getRefBaseResources(refItem, false, skipCheckLineItem).then(function (resList) {
					return angular.copy(resList);
				},
				function (/* error */) {
				});
			};

			return service;
		}]);
})();
