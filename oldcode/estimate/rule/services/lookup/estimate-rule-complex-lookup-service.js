/**
 * Created by joshi on 19.01.2016.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleComplexLookupService
	 * @function
	 *
	 * @description
	 * estimateRuleComplexLookupService provides all lookup data for estimate Rules complex lookup
	 */
	angular.module(moduleName).factory('estimateRuleComplexLookupService', ['$http', '$injector', '$q', 'estimateMainService', 'cloudCommonGridService', 'estimateRuleCommonService', 'estimateRuleMasterDataFilterService', 'estimateProjectRateBookConfigDataService',
		function ($http, $injector, $q, estimateMainService, cloudCommonGridService, estimateRuleCommonService, estimateRuleMasterDataFilterService, estimateProjectRateBookConfigDataService) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estRuleItems:[]
			};

			let getProjectId = function getProjectId(){
				let project = $injector.get('projectMainService').getSelected();
				if (project && project.Id > 0){
					return project.Id;
				}
				else {
					return estimateMainService.getSelectedProjectId();
				}
			};

			function treeFilter(items, childProp, filterFunc){

				let result = [];

				_.forEach(items, function(item){

					let childrenItems;

					let currentItem = item;

					let filterResult = filterFunc(item);

					if(item[childProp] && angular.isArray(item[childProp]) && item[childProp].length > 0){

						childrenItems = treeFilter(item[childProp], childProp, filterFunc);
					}

					if(childrenItems && angular.isArray(childrenItems)){
						currentItem = angular.copy(item);
						currentItem[childProp] = childrenItems;
					}

					if(filterResult || (childrenItems && angular.isArray(childrenItems) && childrenItems.length > 0)){
						result.push(currentItem);
					}
				});

				return result;
			}

			function isForBoq(boqItem){
				return boqItem.IsForBoq === true;
			}

			function isForEstimate(boqItem){
				return boqItem.IsForEstimate === true;
			}

			service.filterRuleByBoq = function filterRuleByBoq(rules, config){
				if(!!config && !!config.lookupOptions){
					// eslint-disable-next-line no-prototype-builtins
					if(config.isForBoq || config.lookupOptions.hasOwnProperty('isForBoq')){
						return treeFilter(rules, 'CustomEstRules', isForBoq);
					}
				}

				return treeFilter(rules, 'CustomEstRules', isForEstimate);
			};

			service.getEstRuleItemsPromise = function(){
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/compositelist', {projectFk : getProjectId()});
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList(config) {
				if(lookupData.estRuleItems.length >0){
					return service.filterRuleByBoq(lookupData.estRuleItems, config);
				}
				else{
					return [];
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync(config) {
				if(lookupData.estRuleItems && lookupData.estRuleItems.length >0){
					return $q.when(service.filterRuleByBoq(lookupData.estRuleItems, config));
				}
				else{
					return service.getEstRuleItemsPromise().then(function(response){
						lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForEstimate', true);
						return service.filterRuleByBoq(lookupData.estRuleItems, config);
					});
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				if(!value){return;}
				let items = [];
				let list = lookupData.estRuleItems;
				if(list && list.length>0){
					let output = [];
					list = cloudCommonGridService.flatten(list, output, 'CustomEstRules');
					for (let i = 0; i < list.length; i++) {
						for (let j = 0; j < value.length; j++) {
							if (list[i].Code === value[j].Code) {
								items.push(list[i]);
								break;
							}
						}
					}
				}
				items = _.sortBy(items, ['Code']);
				return _.uniq(items, 'Code');
			};

			// get list of the estimate boq items by filter value
			service.getSearchList = function getSearchList(value, config, scope) {
				let searchData = {
					projectFk : getProjectId(),
					filterValue : value
				};

				if(angular.isUndefined(value) && lookupData.estRuleItems){
					return $q.when(service.filterRuleByBoq(lookupData.estRuleItems, scope.settings));
				}

				if (!lookupData.searchRuleItemsPromise) {
					lookupData.searchRuleItemsPromise = $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/compositelist', searchData);
				}
				return lookupData.searchRuleItemsPromise.then(function (response) {
					lookupData.searchRuleItemsPromise = null;
					let estRuleItems = response.data.EstRulesEntities;

					response.data.EstRulesEntities = estimateRuleMasterDataFilterService.filterRuleItemsByMasterData(estRuleItems, 'Id');

					let searchData = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForEstimate');
					_.forEach(searchData, function(item) {
						item.Id = item.OriginalMainId;
					});
					if(value === ''){
						lookupData.estRuleItems = searchData;
					}
					return service.filterRuleByBoq(searchData, scope.settings);
				});
			};

			service.loadLookupData = function () {
				// the cache data is from the ruleComboService, refresh it, and check it refresh or not
				return service.getEstRuleItemsPromise().then(function(response){
					estimateProjectRateBookConfigDataService.initData().then(function(){
						lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForEstimate', true);

						let ruleComboService = $injector.get('estimateRuleComboService');
						if(ruleComboService){
							ruleComboService.updateItemList(lookupData.estRuleItems);
						}
						let ruleDataService = $injector.get('estimateMainRuleDataService');
						if(ruleDataService){
							ruleDataService.updateItemList(lookupData.estRuleItems);
						}
						return lookupData.estRuleItems;
					});
				});
			};

			// clear lookup data
			service.clear = function(){
				lookupData.estRuleItems = [];
			};

			service.setCompositeRuleItems = function(compositeRuleItems){
				lookupData.estRuleItems = compositeRuleItems;
			};

			return service;
		}]);
})();
