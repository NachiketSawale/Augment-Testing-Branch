/**
 * Created by leo on 26.08.2015.
 */
(function () {
	'use strict';
	const basicsModule = angular.module('basics.common');

	/**
	 * @ngdoc service
	 * @name basicsCommonGroupingHierarchyDataService
	 * @function
	 *
	 * @description
	 * basicsCommonGroupingHierarchyDataService is a data service for managing grouping hierarchies in all modules
	 */
	basicsModule.factory('basicsCommonGroupingHierarchyDataService', ['platformDataServiceFactory', 'globals', 'schedulingSchedulePresentService',

		function (platformDataServiceFactory, globals, schedulingSchedulePresentService) {

			const basicsCommonGroupingHierarchyServiceOption = {
				module: basicsModule,
				serviceName: 'basicsCommonGroupingHierarchyDataService',
				entityNameTranslationID: 'basics.common.groupingHierarchyEntity',
				httpRead: {route: globals.webApiBaseUrl + 'basics/common/grouping/', endRead: 'hierarchy'},
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Children',
					}
				},
				entitySelection: {}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(basicsCommonGroupingHierarchyServiceOption);
			const data = serviceContainer.data;
			serviceContainer.data.selectedModule = '';

			function clearList() {
				data.itemList.length = 0;
			}

			serviceContainer.service.setSelectedModule = function setSelectedModule(mod) {
				if (mod !== data.selectedModule) {
					data.selectedModule = mod;
					clearList();
				}
			};

			const selectedSchedule = schedulingSchedulePresentService.getSelected();
			if (selectedSchedule && selectedSchedule.Id) {
				serviceContainer.service.setFilter('mainItemID=' + selectedSchedule.Id);
				serviceContainer.service.load();
			}

			schedulingSchedulePresentService.registerSelectionChanged(selectedSchedule);

			return serviceContainer.service;
		}
	]);
})();