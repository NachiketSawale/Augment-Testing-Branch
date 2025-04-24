(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentAssignmentDataService
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateEquipmentAssignmentDataService is the data service for all plants related functionality.
	 */
	const moduleName = 'resource.plantestimate';
	const resourceModule = angular.module(moduleName);
	resourceModule.service('resourcePlantEstimateEquipmentAssignmentDataService', ResourcePlantEstimateEquipmentAssignmentDataService);

	ResourcePlantEstimateEquipmentAssignmentDataService.$inject = ['_', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateEquipmentAssignmentDataService(_, platformDataServiceFactory,
	  mandatoryProcessor,  resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentDataService) {
		const self = this;

		const factoryOptions = {
			flatLeafItem: {
				module: resourceModule,
				serviceName: 'resourcePlantEstimateEquipmentAssignmentDataService',
				entityNameTranslationID: 'resource.equipment.entityResourcePlantEstimateEquipmentAssignment',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantassignment/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantAssignment', parentService: resourcePlantEstimateEquipmentDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(factoryOptions, self);

		serviceContainer.data.newEntityValidator = mandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimateEquipmentAssignmentValidationService'
		}, resourcePlantEstimateConstantValues.schemes.plantAssignment));
	}
})(angular);
