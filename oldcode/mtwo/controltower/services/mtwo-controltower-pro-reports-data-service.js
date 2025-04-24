/**
 * Created by waldrop on 2019-06-26.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerProReportsDataService
	 * @function
	 *
	 * @description
	 * mtwoControlTowerProReportsDataService is the data service for ControlTower Reports Controller related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';

	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerProReportsDataService', MtwoControlTowerProReportsDataService);

	MtwoControlTowerProReportsDataService.$inject = [
		'platformDataServiceFactory',
		'PlatformMessenger',
		'mtwoControlTowerUserListDataService',
		'$injector'];

	function MtwoControlTowerProReportsDataService(
		platformDataServiceFactory,
		PlatformMessenger,
		mtwoControlTowerUserListDataService,
		$injector) {

		var options = {
			flatLeafItem: {
				module: ControlTowerModule,
				serviceName: 'mtwoControlTowerProReportsDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbiitem/',
					endRead: 'getfiltered_reportitemlist',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						if (mtwoControlTowerUserListDataService.hasSelection()) {
							var item = mtwoControlTowerUserListDataService.getSelected();
							readData.Authorized = item.Authorized;
							readData.Id = item.Id;
						}
						return readData;
					}

				},
				entityRole: {
					node: {
						codeField: 'Name',
						descField: 'Description',
						itemName: 'Name',
						moduleName: 'cloud.desktop.moduleDisplayNameControlTower',
						parentService: mtwoControlTowerUserListDataService
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
								data.handleReadSucceeded(readData, data);
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
					uid: 'mtwoControlTowerProReportsDataService',
					title: 'mtwo.controltower.reports',
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
		var serviceContainer = platformDataServiceFactory.createNewComplete(options);

		var service = serviceContainer.service;

		service.onRowChange = new PlatformMessenger();

		return service;
	}
})(angular);
