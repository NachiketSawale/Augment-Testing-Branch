/**
 * Created by baf on 30.01.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentCompatibleMaterialDataService
	 * @description pprovides methods to access, create and update resource equipment compatibleMaterial entities
	 */
	myModule.service('resourceEquipmentCompatibleMaterialDataService', ResourceEquipmentCompatibleMaterialDataService);

	ResourceEquipmentCompatibleMaterialDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentCompatibleMaterialDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantDataService) {
		var self = this;
		var resourceEquipmentCompatibleMaterialServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentCompatibleMaterialDataService',
				entityNameTranslationID: 'resource.equipment.compatibleMaterialEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/compatiblematerial/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.compatibleMaterial)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CompatibleMaterial', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentCompatibleMaterialServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentCompatibleMaterialValidationService'
		}, resourceEquipmentConstantValues.schemes.compatibleMaterial));
	}
})(angular);
