
(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateRuleRemoveLookupService', ['$http', '$injector', '$q', 'estimateMainService','basicsLookupdataTreeHelper',
		function ($http, $injector, $q, estimateMainService,basicsLookupdataTreeHelper) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estRuleItems: []
			};

			service.buildTree = function buildTree(items) {
				items = _.sortBy (items, ['Sorting', 'Code']);
				angular.forEach (items, function (d) {
					if (d.PrjEstRuleFk !== null) {
						let parent = _.find (items, {Id: d.PrjEstRuleFk});
						if (!parent) {
							d.PrjEstRuleFk = null;
						}
					}
				});

				let context = {
					treeOptions: {
						parentProp: 'PrjEstRuleFk',
						childProp: 'PrjEstRules'
					},
					IdProperty: 'Id'
				};
				let result = basicsLookupdataTreeHelper.buildTree (items, context);
				return result;
			};


			service.getEstRuleItemsPromise = function () {
				let param = {
					projectFk: estimateMainService.getSelectedProjectId (),
					estHeaderFks: [estimateMainService.getSelectedEstHeaderId ()],
					filterValue: ''
				};
				return $http.post (globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/getPrjEstRulesOfCurrentEstHeader', param);
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList() {
				if (lookupData.estRuleItems.length > 0) {
					return service.buildTree (lookupData.estRuleItems);
				} else {
					return [];
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				if (lookupData.estRuleItems && lookupData.estRuleItems.length > 0) {
					return $q.when (service.buildTree (lookupData.estRuleItems));
				} else {
					return service.getEstRuleItemsPromise ().then (function (response) {
						lookupData.estRuleItems = response.data;
						return service.buildTree (lookupData.estRuleItems);
					});
				}
			};

			service.getSearchList = function getSearchList(value) {
				let searchData = {
					projectFk: estimateMainService.getSelectedProjectId(),
					estHeaderFks: [estimateMainService.getSelectedEstHeaderId ()],
					filterValue: value
				};

				if (angular.isUndefined (value) && lookupData.estRuleItems) {
					return $q.when (service.buildTree (lookupData.estRuleItems));
				}

				if (!lookupData.searchRuleItemsPromise) {
					lookupData.searchRuleItemsPromise = $http.post (globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/getPrjEstRulesOfCurrentEstHeader', searchData);
				}
				return lookupData.searchRuleItemsPromise.then (function (response) {
					lookupData.searchRuleItemsPromise = null;
					let searchData = response.data;

					if (value === '') {
						lookupData.estRuleItems = response.data;
					}
					return service.buildTree (searchData);
				});
			};


			// clear lookup data
			service.clear = function () {
				lookupData.estRuleItems = [];
				lookupData.searchRuleItemsPromise = null;
			};

			service.setCompositeRuleItems = function (compositeRuleItems) {
				lookupData.estRuleItems = compositeRuleItems;
			};

			return service;
		}]);
})();
