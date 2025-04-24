(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentAccessoryDataService
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateEquipmentAccessoryDataService is the data service for all plant accessories related functionality.
	 */
	const moduleName = 'resource.plantestimate';
	const resourceModule = angular.module(moduleName);
	resourceModule.service('resourcePlantEstimateEquipmentAccessoryDataService', ResourcePlantEstimateEquipmentAccessoryDataService);

	ResourcePlantEstimateEquipmentAccessoryDataService.$inject = ['_', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateEquipmentAccessoryDataService(_, platformDataServiceFactory,
	  mandatoryProcessor, resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentDataService) {
		const self = this;

		const factoryOptions = {
			flatLeafItem: {
				module: resourceModule,
				serviceName: 'resourcePlantEstimateEquipmentAccessoryDataService',
				entityNameTranslationID: 'resource.equipment.entityPlantAccessory',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantaccessory/',
					endRead: 'listbyparent',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					leaf: {
						itemName: 'PlantAccessory',
						parentService: resourcePlantEstimateEquipmentDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(factoryOptions, self);
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimateEquipmentAccessoryValidationService'
		}, resourcePlantEstimateConstantValues.schemes.plantAccessory));
	}
})(angular);
