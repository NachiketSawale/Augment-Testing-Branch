(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnit2ObjUnitService
	 * @function
	 *
	 * @description
	 * objectMainUnit2ObjUnitService is the data service for all Unit Area related functionality.
	 */
	var moduleName= 'object.main';
	var objectMainUnit2ObjUnitModule = angular.module(moduleName);
	objectMainUnit2ObjUnitModule.factory('objectMainUnit2ObjUnitService', ['platformDataServiceFactory','objectMainUnitService','objectMainUnit2ObjUnitValidationProcessor', 'allProjectParkingSpaceObjectUnitDataService',

		function (platformDataServiceFactory, objectMainUnitService, objectMainUnit2ObjUnitValidationProcessor, allProjectParkingSpaceObjectUnitDataService) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainUnit2ObjUnitModule,
					serviceName: 'objectMainUnit2ObjUnitService',
					entityNameTranslationID: 'object.main.entityObjectMainUnit2ObjUnit',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'object/main/unit2objunit/',
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
						leaf: {itemName: 'Unit2ObjUnit', parentService: objectMainUnitService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = objectMainUnit2ObjUnitValidationProcessor;

			serviceContainer.service.canCreate = function canCreate() {
				var parentSel = objectMainUnitService.getSelected();
				return objectMainUnitService.isSelection(parentSel) && !parentSel.IsParkingSpace && allProjectParkingSpaceObjectUnitDataService.hasUnassignedParkingSpace();
			};


			return serviceContainer.service;

		}]);
})(angular);
