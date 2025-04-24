/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerMainService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerMainService is the data service for all ControlTower related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerProDashboardService', MtwoControlTowerProDashboardService);
	MtwoControlTowerProDashboardService.$inject = [
		'platformDataServiceFactory',
		'PlatformMessenger',
		'$injector',
		'mtwoControlTowerUserListDataService'];

	function MtwoControlTowerProDashboardService(
		platformDataServiceFactory,
		PlatformMessenger,
		$injector, mtwoControlTowerUserListDataService) {

		var mtwoControlTowerProDashboardService = {
			flatLeafItem: {
				module: ControlTowerModule,
				serviceName: 'mtwoControlTowerMainService',
				httpRead: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbiitem/',
					endRead: 'getfiltereddashboarditemlist',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						if (mtwoControlTowerUserListDataService.hasSelection()) {
							var selectedItem = mtwoControlTowerUserListDataService.getSelected();
							readData.Authorized = selectedItem.Authorized;
							readData.Id = selectedItem.Id;
							return readData;
						}
					}
				},
				actions: {delete: false, create: false, group: false},
				entityRole: {
					root: {
						codeField: 'Name',
						descField: 'Description',
						itemName: 'Name',
						moduleName: 'cloud.desktop.moduleDisplayNameControlTower'
					}
				},
				entitySelection: {},
				presenter: {
					list: {
						incorporateDataRead: function incorporateDataRead(readData, data) {

							var premium = $injector.get('mtwoControlTowerCommonService').getPremiumStatus();

							if (premium) {
								return null;
							} else {
								if (readData && Object.prototype.hasOwnProperty.call(readData, 'dtos')) {
									data.handleReadSucceeded(readData, data);
								}
							}
						},
						isInitialSorted: true,
						sortOptions: {
							initialSortColumn: {
								field: 'Name',
								id: 'Name'
							},
							isAsc: true
						}
					}
				},
				translation: {
					uid: 'mtwoControlTowerProDashboardService',
					title: 'mtwo.controltower.proDashboards',
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

		var serviceContainer = platformDataServiceFactory.createNewComplete(mtwoControlTowerProDashboardService);
		var service = serviceContainer.service;
		service.onRowChange = new PlatformMessenger();
		return service;
	}
})(angular);
