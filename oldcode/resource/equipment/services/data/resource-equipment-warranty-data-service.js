/**
 * Created by baf on 15.07.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	const equipmentModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentWarrantyDataService
	 * @description pprovides methods to access, create and update resource equipment warranty entities
	 */
	equipmentModule.service('resourceEquipmentWarrantyDataService', ResourceEquipmentWarrantyDataService);

	ResourceEquipmentWarrantyDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantComponentDataService'];

	function ResourceEquipmentWarrantyDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantComponentDataService) {
		let self = this;
		const resourceEquipmentWarrantyServiceOption = {
			flatLeafItem: {
				module: equipmentModule,
				serviceName: 'resourceEquipmentWarrantyDataService',
				entityNameTranslationID: 'resource.equipment.warrantyEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/component/warranty/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantComponentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.plantWarranty)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantComponentDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.PlantFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Warranties', parentService: resourceEquipmentPlantComponentDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentWarrantyServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentWarrantyValidationService'
		}, resourceEquipmentConstantValues.schemes.plantWarranty));
	}
})(angular);
