/**
 * Created by nitsche on 11.02.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantCostVDataService
	 * @description pprovides methods to access, create and update resource equipment  entities
	 */
	myModule.service('resourceEquipmentPlantCostVDataService', resourceEquipmentPlantCostVDataService);

	resourceEquipmentPlantCostVDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantDataService','platformDataServiceEntityReadonlyProcessor','resourceEquipmentConstantValues'];

	function resourceEquipmentPlantCostVDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantDataService,platformDataServiceEntityReadonlyProcessor,resourceEquipmentConstantValues) {
		var self = this;
		var resourceEquipmentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentPlantCostVDataService',
				entityNameTranslationID: 'resourceEquipmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantcost/',
					endRead: 'listbyplant',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.plantCostV),
					platformDataServiceEntityReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantCostV', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
