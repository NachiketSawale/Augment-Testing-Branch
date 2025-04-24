(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAssignmentDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantAssignmentDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantAssignmentDataService', ['resourceEquipmentPlantDataService', 'platformDataServiceFactory','resourceEquipmentPlantAssignmentValidationProcessor',
		function (resourceEquipmentPlantDataService, platformDataServiceFactory, resourceEquipmentPlantAssignmentValidationProcessor) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantAssignmentDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantAssignment',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plantassignment/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName:'PlantAssignment', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = resourceEquipmentPlantAssignmentValidationProcessor;
			return service;
		}]);
})(angular);
