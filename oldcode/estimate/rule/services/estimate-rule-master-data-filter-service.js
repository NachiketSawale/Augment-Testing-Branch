/**
 * Created by myh on 10.04.2020.
 */

(function (angular) {
	'use strict';
	/* global _ */
	/**
     * @ngdoc service
     * @name estimateRuleMasterDataFilterService
     * @function
     * @description
     * estimateRuleMasterDataFilterService is the filter service for estimate rule filter by Master Data.
     */

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleMasterDataFilterService', ['$q', 'estimateProjectRateBookConfigDataService', // 'basicsLookupdataTreeHelper',
		function ($q, estimateProjectRateBookConfigDataService// , basicsLookupdataTreeHelper
		) {
			let service = {}, filterItemIds = [];

			// filter rule trees by project ratebook
			service.filterRuleByMasterData = function filterRuleByMasterData(rules, filterField) {
				let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(5);
				let filteredRules = [];

				if(!filterField){
					filterField = 'Id';
				}

				if(filterIds && filterIds.length >0) {
					_.each(rules, function (rule) {
						if (_.includes(filterIds, rule[filterField])) {
							filteredRules.push(rule);
						}
					});
				}else{
					filteredRules = rules;
				}

				return filteredRules;
			};

			// filter rule items by existed filterItemIds
			service.filterRuleItemsByMasterData = function filterRuleItemsByMasterData(rules, filterField) {
				let filteredRules = [];

				if(!filterField){
					filterField = 'Id';
				}

				if(filterItemIds && filterItemIds.length >0) {
					_.each(rules, function (rule) {
						if (_.includes(filterItemIds, rule[filterField])) {
							filteredRules.push(rule);
						}
					});
				}

				return filteredRules;
			};

			service.setRuleFilterIds = function setRuleFilterIds(ruleIds){
				filterItemIds = ruleIds;
			};

			return service;
		}]);
})(angular);
