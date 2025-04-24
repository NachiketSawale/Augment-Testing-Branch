/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals , _ */
	'use strict';

	const moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainRuleDataService
	 * @function
	 * @description
	 * estimateMainRuleDataService is the data service for estimate main rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainRuleDataService', ['$injector', '$q', 'estimateRuleServiceFactory', 'estimateMainService', 'cloudCommonGridService',
		'basicsLookupdataTreeHelper', 'estimateRuleCommonService', 'estimateProjectRateBookConfigDataService', 'PlatformMessenger',
		function ($injector, $q, estimateRuleServiceFactory, estimateMainService, cloudCommonGridService, basicsLookupdataTreeHelper, estimateRuleCommonService, estimateProjectRateBookConfigDataService, PlatformMessenger) {
			let projectId = estimateMainService.getSelectedProjectId();
			let options = {
				module: estimateMainModule,
				moduleName: 'estimate.rule',
				serviceName: 'estimateMainRuleDataService',
				httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
				readRoute: 'estimate/rule/projectestimaterule/',
				endRead: 'compositelist',
				entityRole: {
					node: {
						descField: 'DescriptionInfo',
						itemName: 'EstRuleComplete',
						moduleName: 'Estimate Rule',
						parentService: estimateMainService
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

			data.doNotLoadOnSelectionChange = true;
			data.usesCache = true;

			angular.extend(data, {
				showHeaderAfterSelectionChanged: null
			});

			let service = serviceContainer.service;

			service.onUpdateData = new PlatformMessenger();
			service.unloadSubEntities = function doNothing() {
			};

			service.provideUpdateData = function (updateData) {
				service.onUpdateData.fire(updateData);
				return updateData;
			};

			service.init = function () {
				projectId = estimateMainService.getProjectId();
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

			function setList(items) {
				data.selectedItem = null;
				data.itemList.length = 0;
				data.itemTree.length = 0;
				_.forEach(items, function (item) {
					data.itemList.push(item);
					data.itemTree.push(item);
				});
				data.listLoaded.fire();
			}

			service.updateItemList = function (rules) {
				if(!rules){
					return;
				}
				setList(rules);
				if(_.isFunction(service.refresh)){
					service.refresh();
				}
			};

			service.isProjectRuleSelected = function isProjectRuleSelected() {
				let selectedItem = service.getSelected();
				return selectedItem && selectedItem.IsPrjRule;
			};

			return service;
		}]);
})();
