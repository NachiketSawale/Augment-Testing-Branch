/**
 * Created by baf on 03.05.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentControllingUnitDataService
	 * @description pprovides methods to access, create and update resource equipment controllingUnit entities
	 */
	myModule.service('resourceEquipmentControllingUnitDataService', ResourceEquipmentControllingUnitDataService);

	ResourceEquipmentControllingUnitDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentControllingUnitDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                     basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantDataService) {
		var self = this;
		var resourceEquipmentControllingUnitServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentControllingUnitDataService',
				entityNameTranslationID: 'resource.equipment.controllingUnitEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/controllingUnit/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;

					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.controllingUnit)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;

						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ControllingUnits', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentControllingUnitServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentControllingUnitValidationService'
		}, resourceEquipmentConstantValues.schemes.controllingUnit));
	}
})(angular);
