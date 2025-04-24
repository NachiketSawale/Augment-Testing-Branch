/**
 * Created by lal on 2018-06-26.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerReportsService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerReportsService is the data service for all ControlTower related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('mtwoControlTowerReportsService', MtwoControlTowerReportsService);
	MtwoControlTowerReportsService.$inject = [
		'platformDataServiceFactory',
		'PlatformMessenger',
		'$injector',
		'mtwoControlTowerUserListDataService'];

	function MtwoControlTowerReportsService(
		platformDataServiceFactory,
		PlatformMessenger,
		$injector,
		mtwoControlTowerUserListDataService) {

		var options = {
			flatNodeItem: {
				module: ControlTowerModul,
				serviceName: 'mtwoControlTowerReportsService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/controltower/powerbiitem/',
					endRead: 'getreportitemlist'
				},
				actions: {delete: false, create: false, group: false},
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

							if (!premium) {
								return null;
							} else {
								data.handleReadSucceeded(readData, data);
							}
						}, isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'Name', id: 'Name'}, isAsc: true}
					}
				},
				translation: {
					uid: 'mtwoControlTowerReportsService',
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
		var service = {};
		service = serviceContainer.service;
		service.onRowChange = new PlatformMessenger();

		return service;
	}
})(angular);
