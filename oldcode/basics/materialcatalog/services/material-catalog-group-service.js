(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals */
	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).factory('basicsMaterialCatalogMaterialGroupService',
		['platformDataServiceFactory', 'basicsMaterialCatalogService', 'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupFilterService', 'ServiceDataProcessArraysExtension',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService, ServiceDataProcessArraysExtension) {

				var serviceContainer = null;
				var service = null;
				var serviceOption = {
					hierarchicalNodeItem: {
						module: angular.module(moduleName),
						httpCreate: { route: globals.webApiBaseUrl + 'basics/materialcatalog/group/' },
						httpRead: {route: globals.webApiBaseUrl + 'basics/materialcatalog/group/'},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
						presenter: {
							tree: {
								parentProp: 'MaterialGroupFk', childProp: 'ChildItems',
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);

									return serviceContainer.data.handleReadSucceeded(readData.Main, data);
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'MaterialGroup',
								parentService: parentService,
								doesRequireLoadAlways:true
							}
						},
						translation: {
							uid: 'basicsMaterialCatalogMaterialGroupService',
							title: 'basics.materialcatalog.view.MaterialGroup',
							columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
							dtoScheme: { typeName: 'MaterialGroupDto', moduleSubModule: 'Basics.MaterialCatalog' }
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				var filters = [
					{
						key: 'basics-materialcatalog-procurement-structure-filter',
						fn: function () {
							return true;
						}
					}
				];

				// overwrite
				var createItem = service.createItem,
					createChildItem = service.createChildItem;

				var doCreate = function doCreateItemAction(doCreateAction){
					parentService.update().then(function(result){
						if(result){
							doCreateAction();
						}
					});
				};

				// updated before create new/sub item, for now it create subItem, it will copy direct parent's attribute and value to subItem,
				// and save subItem backend, so it need save parentItem first
				service.createItem = function(){
					doCreate(createItem);
				};

				service.createChildItem = function(){
					doCreate(createChildItem);
				};

				basicsLookupdataLookupFilterService.registerFilter(filters);

				return service;
			}]);
})(angular);