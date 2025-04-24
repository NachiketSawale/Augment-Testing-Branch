(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnitAreaService
	 * @function
	 *
	 * @description
	 * objectMainUnitAreaService is the data service for all Unit Area related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainUnitAreaModule = angular.module(moduleName);
	objectMainUnitAreaModule.factory('objectMainUnitAreaService', ['platformDataServiceFactory','objectMainUnitService',

		function (platformDataServiceFactory, objectMainUnitService) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainUnitAreaModule,
					serviceName: 'objectMainUnitAreaService',
					entityNameTranslationID: 'object.main.entityObjectMainUnitArea',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/unitarea/',
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
						leaf: {itemName: 'UnitArea', parentService: objectMainUnitService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			return serviceContainer.service;

		}]);
})(angular);
