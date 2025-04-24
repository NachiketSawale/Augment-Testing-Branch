(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals */
	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).factory('basicsMaterialCatalogGroupCharValService',
		['platformDataServiceFactory', 'basicsMaterialCatalogGroupCharService',
			function (dataServiceFactory, parentService) {
				var httpRoute = globals.webApiBaseUrl + 'basics/materialcatalog/groupcharval/';
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCreate: { route: httpRoute },
						httpRead: {route: httpRoute},
						entityRole: {
							leaf: {
								itemName: 'MaterialGroupCharval',
								parentService: parentService
							}
						},
						translation: {
							uid: 'basicsMaterialCatalogGroupCharValService',
							title: 'basics.materialcatalog.HeadTitle.groupCharval',
							columns: [{
								header: 'basics.materialcatalog.characteristic',
								field: 'CharacteristicInfo'
							}],
							dtoScheme: { typeName: 'MaterialGroupCharvalDto', moduleSubModule: 'Basics.MaterialCatalog' }
						}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				return serviceContainer.service;
			}]);
})(angular);