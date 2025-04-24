/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.regionCatalog';
	var basicsRegionCatalogModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsRegionCatalogService
     * @function
     *
     * @description
     * basicsRegionCatalogService is the data service for all unit related functionality.
     */
	basicsRegionCatalogModule.factory('basicsRegionCatalogService', ['$translate', '$injector', 'platformDataServiceFactory', 'platformPermissionService', 'basicsRegionTypeMainService',
		'ServiceDataProcessArraysExtension', '_',

		function ($translate, $injector, platformDataServiceFactory, platformPermissionService, parentService, ServiceDataProcessArraysExtension, _) {
			var serviceContainer;
			var basicsUnitServiceOption = {
				hierarchicalLeafItem: {
					module: basicsRegionCatalogModule,
					serviceName: 'basicsRegionCatalogService',
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/regionCatalog/',
						endCreate: 'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/regionCatalog/',
						initReadData: function initReadData(readData) {
							var selectedItem = parentService.getSelected();
							if (selectedItem && selectedItem.Id > 0) {
								readData.filter = '?RegionTypeId=' + selectedItem.Id;
							}
						},
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
					translation: {
						uid: 'basicsRegionCatalogService',
						title: 'basics.regionCatalog.regionCatalogList',
						columns: [{
							header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }, {
							header: 'basics.regionCatalog.entityCommentTextInfo', field: 'CommentTextInfo'}],
						dtoScheme: { typeName: 'RegionCatalogDto', moduleSubModule: 'Basics.RegionCatalog' }
					},
					entityRole: {
						leaf: {
							itemName: 'RegionCatalog',
							parentService: parentService,
							doesRequireLoadAlways: true,
							handleUpdateDone: function () {
								var basicsUnitLookupDataService = $injector.get('basicsUnitLookupDataService');
								if (basicsUnitLookupDataService) {
									basicsUnitLookupDataService.resetCache({lookupType: 'basicsUnitLookupDataService'});
								}
							}
						}
					},
					presenter: {
						tree: {
							parentProp: 'RegionCatalogFk', childProp: 'ChildItems',
							initCreationData: function initCreationData(creationData) {
								var selectedItem = parentService.getSelected();

								if (selectedItem && selectedItem.Id > 0) {
									creationData.RegionTypeFk = selectedItem.Id;
								}
								var parentId = creationData.parentId;
								delete creationData.parentId;
								var allItem;
								if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.RegionCatalogFk = parentId;
									allItem = service.filter(parentId);
								}
								else {
									allItem = service.filter(null);
								}
								if (allItem.length === 0) {
									creationData.Sorting = 0;
								}
								else {
									allItem.sort(this.sortId);
									creationData.Sorting = allItem[allItem.length - 1].Sorting + 1;
								}
							}
						}
					},
					actions: {
						delete: true, create: 'hierarchical'
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsUnitServiceOption);
			var service = serviceContainer.service;
			var data = serviceContainer.data;

			service.filter = function (parentId) {
				var allItem = _.filter(data.itemList, {RegionCatalogFk: parentId});
				return allItem;
			};

			this.sortId = function (a, b) {
				return a.Sorting - b.Sorting;
			};

			return service;

		}]);
})(angular);
