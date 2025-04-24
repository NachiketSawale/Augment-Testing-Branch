/**
 * Created by joshi on 26.11.2015.
 */
(function (angular) {

	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';
	let estimateRuleModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateRuleComboService
	 * @function
	 * @description
	 * estimateRuleComboService is the data service for project estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateRuleModule.factory('estimateRuleComboService', ['$injector', '$q', 'estimateRuleServiceFactory', 'estimateMainService', 'cloudCommonGridService',
		'basicsLookupdataTreeHelper', 'estimateRuleCommonService', 'estimateProjectRateBookConfigDataService',
		function ($injector, $q, estimateRuleServiceFactory, estimateMainService, cloudCommonGridService, basicsLookupdataTreeHelper, estimateRuleCommonService, estimateProjectRateBookConfigDataService) {
			let projectId = estimateMainService.getSelectedProjectId();
			let options = {
				module: estimateRuleModule,
				moduleName: 'estimate.rule',
				serviceName: 'estimateRuleComboService',
				httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
				readRoute: 'estimate/rule/projectestimaterule/',
				endRead: 'compositelist',
				entityRole: {
					root: {
						addToLastObject: true,
						lastObjectModuleName: 'estimate.main',
						descField: 'DescriptionInfo',
						itemName: 'PrjEstRuleCombo',
						moduleName: 'Estimate Rule'
					}
				},
				parentProp: 'CustomEstRuleFk',
				childProp: 'CustomEstRules',
				incorporateDataRead: function incorporateDataRead(readItems,data) {
					data.isRoot = false;
					// this data can be used in lookup estimateRuleComplexLookupService
					let ruleCompositeItems = estimateRuleCommonService.generateRuleCompositeList(readItems, 'isForEstimate', true);
					let estimateRuleComplexLookupService = $injector.get('estimateRuleComplexLookupService');
					if (estimateRuleComplexLookupService) {
						estimateRuleComplexLookupService.setCompositeRuleItems(ruleCompositeItems);
					}

					return ruleCompositeItems;
				}
			};

			/* jshint -W003 */
			let serviceContainer = estimateRuleServiceFactory.createNewPrjRuleService(options, estimateMainService);
			let data = serviceContainer.data;

			angular.extend(data, {
				showHeaderAfterSelectionChanged: null
			});

			let service = serviceContainer.service;

			service.init = function () {
				projectId = estimateMainService.getSelectedProjectId();
				if (projectId) {
					return estimateProjectRateBookConfigDataService.initData().then(function(/* response */){
						service.load();
					});
				}
			};

			service.initEx = function (projectFk) {
				if (projectFk) {
					projectId = projectFk;
					let list = service.getList();
					if (!list || list.length < 1) {
						service.load();
					}
				}
			};

			service.updateItemList = function (rules) {
				service.setList(rules);
				service.refresh();
			};

			return service;
		}]);
})(angular);
