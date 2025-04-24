/**
 * Created by baf on 18.08.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('resource.plantestimate');

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentSpecificValueDataService
	 * @description provides methods to access, create and update resource equipment specificValue entities
	 */
	myModule.service('resourcePlantEstimateEquipmentSpecificValueDataService', ResourcePlantEstimateEquipmentSpecificValueDataService);

	ResourcePlantEstimateEquipmentSpecificValueDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateEquipmentSpecificValueDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentDataService) {
		const self = this;
		const resourceEquipmentSpecificValueServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourcePlantEstimateEquipmentSpecificValueDataService',
				entityNameTranslationID: 'resource.equipment.specificValueEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantspecificvalue/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						const selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourcePlantEstimateConstantValues.schemes.specificValue)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'SpecificValues', parentService: resourcePlantEstimateEquipmentDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(resourceEquipmentSpecificValueServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimateEquipmentSpecificValueValidationService'
		}, resourcePlantEstimateConstantValues.schemes.specificValue));
	}
})(angular);