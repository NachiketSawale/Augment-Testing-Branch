(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnitPriceService
	 * @function
	 *
	 * @description
	 * objectMainUnitPriceService is the data service for all Main related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainUnitPriceModule = angular.module(moduleName);
	objectMainUnitPriceModule.factory('objectMainUnitPriceService', ['platformDataServiceFactory','objectMainUnitService',

		function (platformDataServiceFactory, objectMainUnitService) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainUnitPriceModule,
					serviceName: 'objectMainService',
					entityNameTranslationID: 'object.main.entityObjectMainUnitPrice',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/unitprice/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = objectMainUnitService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = objectMainUnitService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'UnitPrice', parentService: objectMainUnitService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return serviceContainer.service;

		}]);
})(angular);
