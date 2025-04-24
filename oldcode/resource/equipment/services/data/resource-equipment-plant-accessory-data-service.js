(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAccessoryDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantAccessoryDataService is the data service for all plant accessories related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantAccessoryDataService', ['platformDataServiceFactory', 'resourceEquipmentPlantDataService', 'basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, resourceEquipmentPlantDataService, mandatoryProcessor) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantAccessoryDataService',
					entityNameTranslationID: 'resource.equipment.entityPlantAccessory',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plantaccessory/', endRead: 'listbyparent', endDelete: 'multidelete', usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entitySelection: { supportsMultiSelection: true },
					entityRole: {
						leaf: {
							itemName: 'PlantAccessory',
							parentService: resourceEquipmentPlantDataService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			    mustValidateFields: true,
			    typeName: 'PlantAccessoryDto',
				moduleSubModule: 'Resource.Equipment',
				validationService: 'resourceEquipmentPlantAcessoryValidationService'
			});

			return serviceContainer.service;
		}]);
})(angular);
