/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentSpecificValueDataService
	 * @description provides methods to access, create and update resource equipment specificValue entities
	 */
	myModule.service('resourceEquipmentSpecificValueDataService', ResourceEquipmentSpecificValueDataService);

	ResourceEquipmentSpecificValueDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentSpecificValueDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantDataService) {
		const self = this;
		const resourceEquipmentSpecificValueServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentSpecificValueDataService',
				entityNameTranslationID: 'resource.equipment.specificValueEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantspecificvalue/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						const selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.specificValues)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'SpecificValues', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(resourceEquipmentSpecificValueServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentPlantSpecificValueValidationService'
		}, resourceEquipmentConstantValues.schemes.specificValues));
	}
})(angular);