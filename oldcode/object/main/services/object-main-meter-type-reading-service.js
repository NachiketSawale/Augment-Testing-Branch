(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainMeterTypeReadingService
	 * @function
	 *
	 * @description
	 * objectMainMeterTypeReadingService is the data service for all meter type reading related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainMeterTypeReadingModule = angular.module(moduleName);
	objectMainMeterTypeReadingModule.factory('objectMainMeterTypeReadingService', ['platformDataServiceFactory','objectMainUnitService','platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, objectMainUnitService, platformDataServiceProcessDatesBySchemeExtension) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainMeterTypeReadingModule,
					serviceName: 'objectMainMeterTypeReadingService',
					entityNameTranslationID: 'object.main.entityObjectMainMeterTypeReading',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/metertypereading/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = objectMainUnitService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'MeterTypeReadingDto', moduleSubModule: 'Object.Main'})],
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
						leaf: {itemName: 'MeterTypeReading', parentService: objectMainUnitService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			return serviceContainer.service;

		}]);
})(angular);
