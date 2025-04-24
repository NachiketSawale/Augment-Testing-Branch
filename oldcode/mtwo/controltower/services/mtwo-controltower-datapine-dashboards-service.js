
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerDataPineDashboardsService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerDataPineDashboardsService is the data service for all ControlTower DataPine related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerDataPineDashboardsService', mtwoControlTowerDataPineDashboardsService);
	mtwoControlTowerDataPineDashboardsService.$inject = [
		'platformDataServiceFactory',
		'PlatformMessenger',
		'$injector',
		'platformObjectHelper',
		'mtwoControlTowerUserListDataService'];

	function mtwoControlTowerDataPineDashboardsService(
		platformDataServiceFactory,
		PlatformMessenger,
		$injector,
		platformObjectHelper,
		mtwoControlTowerUserListDataService) {

		var mtwoControlTowerDataPineDashboardsService = {
			hierarchicalRootItem: {
				module: ControlTowerModule,
				serviceName: 'mtwoControlTowerDataPineDashboardsService',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard2group/',
					endRead: 'tree',
					usePostForRead: true,
					initReadData: function initReadData(readData){
						if(mtwoControlTowerUserListDataService.hasSelection()){
							var selectedItem = mtwoControlTowerUserListDataService.getSelected();
							readData.Authorized = selectedItem.Authorized;
							return readData;
						}
					}
				},
				dataProcessor: [{processItem: processItem}],
				actions: {delete: false, create: false, group: false},
				entityRole: { root: { codeField: 'Name', descField: 'Description', itemName: 'Name', moduleName: 'cloud.desktop.moduleDisplayNameControlTower' } },
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: 'ParentFk', childProp: 'Children',
						incorporateDataRead: function incorporateDataRead(readData, data) {
							data.handleReadSucceeded(readData, data);
						}
					}},
				translation: {
					uid: 'mtwoControlTowerDataPineDashboardsService',
					title: 'mtwo.controltower.dataPineDashboards',
					columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						containsGlobalData: true
					}
				}
			}
		};

		function processItem(item) {
			var parentId = platformObjectHelper.getValue(item,'ParentFk');
			if (!parentId || parentId < 1) {
				item.image = 'ico-accordion-root';
			}else{
				item.image = 'ico-accordion-pos';
			}
		}

		var serviceContainer = platformDataServiceFactory.createNewComplete(mtwoControlTowerDataPineDashboardsService);
		var service = serviceContainer.service;
		service.treePresOpt = serviceContainer.data.treePresOpt;
		service.onRowChange = new PlatformMessenger();
		return service;
	}
})(angular);
