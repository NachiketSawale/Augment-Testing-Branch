/**
 * Created by nitsche on 11.02.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupCostVDataService
	 * @description pprovides methods to access, create and update resource equipment  entities
	 */
	myModule.service('resourceEquipmentGroupCostVDataService', resourceEquipmentGroupCostVDataService);

	resourceEquipmentGroupCostVDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentGroupDataService','platformDataServiceEntityReadonlyProcessor','resourceEquipmentConstantValues'];

	function resourceEquipmentGroupCostVDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentGroupDataService,platformDataServiceEntityReadonlyProcessor,resourceEquipmentConstantValues) {
		var self = this;
		var resourceEquipmentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupCostVDataService',
				entityNameTranslationID: 'resourceEquipmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantcost/',
					endRead: 'listbyplantgroup',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentGroupDataService.getSelected();
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
							var selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantCostV', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
