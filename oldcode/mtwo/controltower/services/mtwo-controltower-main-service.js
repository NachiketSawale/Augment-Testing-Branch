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
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerMainService', MtwoControlTowerMainService);
	MtwoControlTowerMainService.$inject = [
		'platformDataServiceFactory',
		'PlatformMessenger',
		'$injector',
		'mtwoControlTowerUserListDataService'];

	function MtwoControlTowerMainService(
		platformDataServiceFactory,
		PlatformMessenger,
		$injector,
		mtwoControlTowerUserListDataService) {

		var mtwoControlTowerMainServiceOptions = {
			flatNodeItem: {
				module: ControlTowerModul,
				serviceName: 'mtwoControlTowerMainService',
				httpRead: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbiitem/',
					endRead: 'getdashboarditemlist',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(readData, data) {
						if (data.prjID) {
							readData.PKeys = readData.PKeys || [];
							readData.PKeys.push({Id: data.prjID});
						}
					}
				},
				actions: {delete: false, create: false, group: false},
				entityRole: {
					node:
						{
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
							if (!premium) {
								return null;
							} else {
								if (readData && Object.prototype.hasOwnProperty.call(readData, 'dtos')) {
									data.handleReadSucceeded(readData, data);
									// return readData.dtos;
								}
							}
						},
						isInitialSorted: true,
						sortOptions: {
							initialSortColumn: {
								field: 'Name', id: 'Name'
							},
							isAsc: true
						}
					}
				},
				translation: {
					uid: 'mtwoControlTowerMainService',
					title: 'mtwo.controltower.dashboards',
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

		var serviceContainer = platformDataServiceFactory.createNewComplete(mtwoControlTowerMainServiceOptions);
		var service = {};
		service = serviceContainer.service;
		service.onRowChange = new PlatformMessenger();
		return service;
	}
})(angular);
