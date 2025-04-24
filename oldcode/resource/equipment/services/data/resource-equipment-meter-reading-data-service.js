/**
 * Created by baf on 20.05.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentMeterReadingDataService
	 * @description pprovides methods to access, create and update resource equipment meterReading entities
	 */
	myModule.service('resourceEquipmentMeterReadingDataService', ResourceEquipmentMeterReadingDataService);

	ResourceEquipmentMeterReadingDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantComponentDataService'];

	function ResourceEquipmentMeterReadingDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                  basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantComponentDataService) {
		var self = this;
		var resourceEquipmentMeterReadingServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentMeterReadingDataService',
				entityNameTranslationID: 'resource.equipment.meterReadingEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantmeterreading/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantComponentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.meterReading)],
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
					leaf: {itemName: 'MeterReadings', parentService: resourceEquipmentPlantComponentDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentMeterReadingServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentMeterReadingValidationService'
		}, resourceEquipmentConstantValues.schemes.meterReading));
	}
})(angular);
