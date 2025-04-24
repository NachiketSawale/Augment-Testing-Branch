(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAllocationDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantAllocationDataService is the data service
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantAllocationDataService', ['platformDataServiceProcessDatesBySchemeExtension','platformDataServiceFactory',
		'resourceEquipmentPlantDataService','resourceEquipmentPlantEurolistValidationProcessor', 'resourceEquipmentConstantValues',
		function (platformDataServiceProcessDatesBySchemeExtension, platformDataServiceFactory,
		          resourceEquipmentPlantDataService,resourceEquipmentPlantEurolistValidationProcessor, resourceEquipmentConstantValues) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantAllocationDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantEurolist',
					httpRead: { route: globals.webApiBaseUrl + 'resource/equipment/allocation/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}},
					actions: {delete: true, create: 'flat'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						resourceEquipmentConstantValues.schemes.plantAllocation)],
					entityRole: {
						leaf: { itemName:'PlantAllocV', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = resourceEquipmentPlantEurolistValidationProcessor;
			return service;
		}]);
})(angular);
