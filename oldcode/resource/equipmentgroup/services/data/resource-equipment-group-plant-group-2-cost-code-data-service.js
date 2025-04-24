/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2CostCodeDataService
	 * @description provides methods to access, create and update Resource EquipmentGroup PlantGroup2CostCode entities
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2CostCodeDataService', ResourceEquipmentGroupPlantGroup2CostCodeDataService);

	ResourceEquipmentGroupPlantGroup2CostCodeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupDataService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupPlantGroup2CostCodeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceEquipmentGroupDataService, resourceEquipmentGroupConstantValues) {
		let self = this;
		let resourceEquipmentGroupServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupPlantGroup2CostCodeDataService',
				entityNameTranslationID: 'resource.equipmentgroup.resourceEquipmentGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/plantgroup2costcode/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantGroup2CostCode', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupPlantGroup2CostCodeValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode));
	}
})(angular);