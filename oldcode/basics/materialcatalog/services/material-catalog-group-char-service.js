(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals */
	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).factory('basicsMaterialCatalogGroupCharService',
		['platformDataServiceFactory', 'basicsMaterialCatalogMaterialGroupService',
			function (dataServiceFactory, parentService) {
				var httpRoute = globals.webApiBaseUrl + 'basics/materialcatalog/groupchar/';
				var serviceOption = {
					flatNodeItem: {
						module: angular.module(moduleName),
						httpCreate: { route: httpRoute },
						httpRead: {route: httpRoute},
						entityRole: {
							node: {
								itemName: 'MaterialGroupChar',
								parentService: parentService,
								doesRequireLoadAlways:true
							}
						},
						translation: {
							uid: 'basicsMaterialCatalogGroupCharService',
							title: 'basics.materialcatalog.HeadTitle.groupChar',
							columns: [{
								header: 'basics.materialcatalog.property',
								field: 'PropertyInfo'
							}],
							dtoScheme: { typeName: 'MaterialGroupCharDto', moduleSubModule: 'Basics.MaterialCatalog' }
						}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				return serviceContainer.service;
			}]);
})(angular);