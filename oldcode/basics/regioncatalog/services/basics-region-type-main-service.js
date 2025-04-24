/**
 * Created by jhe on 7/26/2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.regionCatalog';
	var basicsRegionCatalogModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsRegionTypeMainService
     * @function
     *
     * @description
     * basicsUnitMainService is the data service for all unit related functionality.
     */
	basicsRegionCatalogModule.factory('basicsRegionTypeMainService', ['$http', '$translate', '$injector', 'platformDataServiceFactory',
		'platformPermissionService', 'cloudDesktopSidebarService', 'PlatformMessenger',

		function ($http, $translate, $injector, platformDataServiceFactory, platformPermissionService, cloudDesktopSidebarService, PlatformMessenger) {

			var serviceContainer;

			var basicsRegionCatalogServiceOption = {
				flatRootItem: {
					module: basicsRegionCatalogModule,
					serviceName: 'basicsRegionTypeMainService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/regionCatalog/regionType/',endRead: 'filtered', usePostForRead: true
					},
					actions: {
						delete: false,
						create: false
					},
					translation: {
						uid: 'basicsRegionTypeMainService',
						title: 'basics.regionCatalog.regionTypeList',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'RegionTypeDto', moduleSubModule: 'Basics.RegionCatalog' }
					},
					entityRole: {
						root: {
							codeField: 'RegionType',
							itemName: 'RegionType',
							moduleName: 'cloud.desktop.moduleDisplayNameRegionCatalog'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (result, data) {
								var res = serviceContainer.data.handleReadSucceeded(result, data);
								data.UnitsAreLoaded = true;

								return res;
							}
						}
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
							withExecutionHints: true
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsRegionCatalogServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;
			data.UnitsAreLoaded = false;

			if (platformPermissionService.hasRead('4b02a602e9504978b271011ea1b4f42e')) {
				service.load();
				data.UnitsAreLoaded = true;
			}

			service.hasUnitsLoaded = function hasUnitsLoaded() {
				return data.UnitsAreLoaded;
			};

			return service;

		}]);
})(angular);
