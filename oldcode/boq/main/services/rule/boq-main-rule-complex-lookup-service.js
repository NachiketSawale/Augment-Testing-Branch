/**
 * Created by zos on 1/8/2018.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqRuleComplexLookupService
	 * @function
	 *
	 * @description
	 * boqRuleComplexLookupService provides all lookup data for estimate Rules complex lookup
	 */
	angular.module(moduleName).factory('boqRuleComplexLookupService', ['$http', '$q', '$injector', '_',
		'estimateRuleCommonService', 'cloudCommonGridService', 'estimateMainCommonLookupService', 'estimateRuleMasterDataFilterService',
		function ($http, $q, $injector, _, estimateRuleCommonService, cloudCommonGridService, estimateMainCommonLookupService, estimateRuleMasterDataFilterService) {

			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				estRuleFlatItems: [], // flat item list
				estRuleItems: [],
				navFrom: '',
				projectId: 0,
				boqHeaderId: 0
			};

			service.setNavFromBoqProject = function () {
				lookupData.navFrom = 'project';
			};

			service.setNavFromBoqWic = function () {
				lookupData.navFrom = 'wic';
			};

			service.isNavFromBoqProject = function () {
				return lookupData.navFrom === 'project';
			};

			service.isNavFromBoqWic = function () {
				return lookupData.navFrom === 'wic';
			};

			service.getProjectId = function () {
				return lookupData.projectId;
			};

			service.setProjectId = function (projectId) {
				lookupData.projectId = projectId;
			};

			service.getBoqHeaderId = function () {
				return lookupData.boqHeaderId;
			};

			service.setBoqHeaderId = function (boqHeaderId) {
				lookupData.boqHeaderId = boqHeaderId;
			};

			service.getCompositeRuleItemsPromise = function () {
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/compositelist', {projectFk: service.getProjectId()});
			};

			service.getMdcRuleItemsPromise = function () {
				return $http.get(globals.webApiBaseUrl + 'estimate/rule/estimaterule/list');
			};

			service.refreshDataForWic = function () {
				return service.getMdcRuleItemsPromise().then(function (response) {
					lookupData.estRuleFlatItems = _.sortBy(response.data, ['Sorting', 'Code']);
					lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList({EstRulesEntities: lookupData.estRuleFlatItems}, 'isForBoq');
					return lookupData.estRuleItems;
				});
			};

			function treeFilter(items, childProp, filterFunc) {

				var result = [];

				_.forEach(items, function (item) {

					var childrenItems;

					var currentItem = item;

					var filterResult = filterFunc(item);

					if (item[childProp] && angular.isArray(item[childProp]) && item[childProp].length > 0) {

						childrenItems = treeFilter(item[childProp], childProp, filterFunc);
					}

					if (childrenItems && angular.isArray(childrenItems)) {
						currentItem = angular.copy(item);
						currentItem[childProp] = childrenItems;
					}

					if (filterResult || (childrenItems && angular.isArray(childrenItems) && childrenItems.length > 0)) {
						result.push(currentItem);
					}
				});

				return result;
			}

			function isForBoq(boqItem) {
				return boqItem.IsForBoq;
			}

			service.filterRuleByBoq = function filterRuleByBoq(rules) {
				return treeFilter(rules, 'CustomEstRules', isForBoq);
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList(config) {
				if (lookupData.estRuleItems.length > 0) {
					return service.filterRuleByBoq(lookupData.estRuleItems, config);
				} else {
					return [];
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync(config) {
				if (lookupData.estRuleItems && lookupData.estRuleItems.length > 0) {
					return $q.when(service.filterRuleByBoq(lookupData.estRuleItems, config));
				} else {
					if (lookupData.navFrom === 'wic') {
						return service.getMdcRuleItemsPromise().then(function (response) {
							lookupData.estRuleFlatItems = _.sortBy(response.data, ['Sorting', 'Code']);
							lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList({EstRulesEntities: lookupData.estRuleFlatItems}, 'isForBoq');
							return service.filterRuleByBoq(lookupData.estRuleItems, config);
						});
					} else {
						return service.getCompositeRuleItemsPromise().then(function (response) {
							// todo, this function can be generialized
							lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForBoq', true);
							return service.filterRuleByBoq(lookupData.estRuleItems, config);
						});
					}
				}
			};

			service.getFlatList = function getFlatList() {
				return lookupData.estRuleFlatItems;
			};

			service.getListOriginal = function getListOriginal() {
				if (lookupData.estRuleItems.length > 0) {
					return lookupData.estRuleItems;
				} else {
					return [];
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				if (!value) {
					return;
				}

				var items = [];
				var list = lookupData.estRuleItems;
				var output = [];
				if (lookupData.navFrom === 'wic') {
					if (list && list.length > 0) {
						list = service.getFlatList();
					}
					// return _.find(service.getFlatList(), {'Id': value}) || {};
				} else {
					if (list && list.length > 0) {
						list = cloudCommonGridService.flatten(list, output, 'CustomEstRules');
					}
				}
				for (var i = 0; i < list.length; i++) {
					for (var j = 0; j < value.length; j++) {
						if (list[i].Code === value[j].Code) {
							items.push(list[i]);
							break;
						}
					}
				}
				items = _.sortBy(items, ['Code']);
				return _.uniq(items, 'Code');
			};

			service.getIconValuesByIds = function getIconValuesByIds(ids) {
				return _.map(service.getFlatList().filter(function (e) {
					return _.includes(ids, e.Id);
				}), 'Icon');
			};

			// get list of the estimate boq items by filter value
			service.getSearchList = function getSearchList(value, config, scope) {
				if (lookupData.navFrom === 'wic') {
					var list = service.getList(config, scope);
					var searchRs = [];
					if (list && list.length > 0) {
						if (value) {
							var filterParams = {
								'codeProp': 'Code',
								'descriptionProp': 'DescriptionInfo.Translated',
								'isSpecificSearch': null,
								'searchValue': value
							};
							searchRs = estimateMainCommonLookupService.getSearchData(filterParams, list, 'EstRules', 'EstRuleFk', true);
						} else {
							searchRs = list;
						}
					}
					return $q.when(searchRs);
				} else {
					var searchData = {
						projectFk: service.getProjectId(),
						filterValue: value
					};

					if (angular.isUndefined(value) && lookupData.estRuleItems) {
						return $q.when(service.filterRuleByBoq(lookupData.estRuleItems, config));
					}

					if (!lookupData.searchRuleItemsPromise) {
						lookupData.searchRuleItemsPromise = $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/compositelist', searchData);
					}
					return lookupData.searchRuleItemsPromise.then(function (response) {
						lookupData.searchRuleItemsPromise = null;
						var estRuleItems = response.data.EstRulesEntities;

						response.data.EstRulesEntities = estimateRuleMasterDataFilterService.filterRuleItemsByMasterData(estRuleItems, 'Id');

						var searchData = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForBoq');
						if (value === '') {
							lookupData.estRuleItems = searchData;
						}
						return service.filterRuleByBoq(searchData, config);
					});
				}

			};

			service.loadLookupData = function loadLookupData() {
				if (lookupData.navFrom === 'wic') {
					return service.getMdcRuleItemsPromise().then(function (response) {
						lookupData.estRuleFlatItems = _.sortBy(response.data, ['Sorting', 'Code']);
						lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList({EstRulesEntities: lookupData.estRuleFlatItems}, 'isForBoq');
						return lookupData.estRuleItems;
					});
				} else {
					var rateBookService = $injector.get('estimateProjectRateBookConfigDataService');

					// the cache data is from the ruleComboService, refresh it, and check it refresh or not
					if (rateBookService) {
						return service.getCompositeRuleItemsPromise().then(function (response) {
							rateBookService.initData().then(function () {
								lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForBoq', true);
								return lookupData.estRuleItems;
							});
						});
					}
				}
			};

			// clear lookup data
			service.clear = function () {
				lookupData.estRuleItems = [];
			};

			service.setCompositeRuleItems = function (compositeRuleItems) {
				lookupData.estRuleItems = compositeRuleItems;
			};

			return service;
		}]);
})();
