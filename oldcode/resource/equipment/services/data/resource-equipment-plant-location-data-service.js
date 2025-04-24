(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAllocationDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantAllocationDataService is the data service for summarized plant allocation view records
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantLocationDataService', ['resourceCommonPlantJobLocationFactory', 'resourceEquipmentPlantDataService',
		function (resourceCommonPlantJobLocationFactory, resourceEquipmentPlantDataService) {

			var configuration = {
				serviceOptions: {
					module: resourceModule,
					name: 'resourceEquipmentPlantLocationDataService',
					translationID: 'resource.equipment.entityPlantAllocation',
					parentService: resourceEquipmentPlantDataService,
					itemName: 'PlantAllocV'
				},
				filterOptions: {
					name: 'resource_equipment_plant_location',
					title: 'resource.equipment.locationSettings',
					parentService: resourceEquipmentPlantDataService,
					options:
					{
						isForPlant: true,
						isForJob: false
					}
				}
			};
			var factoryOptions = {};//This is passed as a reference to createPlantJobLocationDataService, so
			//settings can be enhanced if necessary to adjust behaviour...
			var serviceContainer = resourceCommonPlantJobLocationFactory.createPlantJobLocationDataService(factoryOptions, configuration);

			return serviceContainer.service;
		}]);
})(angular);
