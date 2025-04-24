/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainRootService
	 * @function
	 *
	 * @description
	 * estimateMainRootService is the data service for estimate root(header) related rules and parameter.
	 */
	angular.module(moduleName).factory('estimateMainRootService', ['$injector','platformDataServiceFactory', 'estimateMainService', '$translate',
		function ($injector,platformDataServiceFactory, estimateMainService, $translate) {

			let projectId = estimateMainService.getSelectedProjectId();

			let loadData = function () {

				let itemList = [
					{
						'Id': estimateMainService.getSelectedEstHeaderId (),
						'EstHeaderFk':estimateMainService.getSelectedEstHeaderId (),
						'Estimate': $translate.instant ('estimate.main.rootAssignmentRootField'),
						'Rule': [],
						'Param': [],
						'IsEstHeaderRoot': true
					}
				];
				if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
					if (itemList.length > 0) {
						_.forEach(itemList, function (item) {
							$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
						});
					}
				}
				return itemList;

			};

			let estimateMainRootServiceOptions = {
					module: estimateMainModule,
					serviceName: 'estimateMainRootService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadData,
						resourceFunctionParameters: []
					},
					entitySelection: {},
					presenter: {list: {}},
					entityRole: {root: {
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						itemName: 'EstHeader',
						moduleName: 'Estimate Main',
						handleUpdateDone: function (updateData, response) {
							estimateMainService.updateList(updateData, response);
						}
					}},
					actions: {}
				},
				serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainRootServiceOptions),
				service = serviceContainer.service;

			serviceContainer.data.doUpdate = null;

			service.getContainerData =  function getContainerData() {
				return serviceContainer.data;
			};

			let ruleToDelete =[];

			service.setRuleToDelete =  function setRuleToDelete(value) {
				ruleToDelete = value;
			};

			service.getRuleToDelete =  function getRuleToDelete() {
				return ruleToDelete;
			};

			estimateMainService.onContextUpdated.register(function () {
				projectId = estimateMainService.getSelectedProjectId();
				service.setFilter('projectId=' + projectId);
				if (projectId>0) {
					service.load();
				}
			});

			if (projectId>0) {
				service.load();
			}

			return service;
		}]);
})();
