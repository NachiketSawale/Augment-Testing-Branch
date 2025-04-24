(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals */
	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).factory('basicsMaterialCatalogDiscountGroupService',
		['platformDataServiceFactory', 'basicsMaterialCatalogService', 'ServiceDataProcessArraysExtension',
			function (dataServiceFactory, parentService, ServiceDataProcessArraysExtension) {
				var httpRoute = globals.webApiBaseUrl + 'basics/materialcatalog/discountgroup/';
				var serviceOption = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						httpCreate: { route: httpRoute },
						httpRead: {route: httpRoute},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
						presenter: {
							tree: {
								parentProp: 'MaterialDiscountGroupFk', childProp: 'ChildItems'
							}
						},
						entityRole: {
							leaf: {
								itemName: 'MaterialDiscountGroup',
								parentService: parentService
							}
						},
						translation: {
							uid: 'basicsMaterialCatalogDiscountGroupService',
							title: 'basics.materialcatalog.view.DiscountGroup',
							columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
							dtoScheme: { typeName: 'MaterialDiscountGroupDto', moduleSubModule: 'Basics.MaterialCatalog' }
						}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				return serviceContainer.service;
			}]);
})(angular);