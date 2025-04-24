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
	var moduleName= 'logistic.job';
	var logisticModule = angular.module(moduleName);
	logisticModule.factory('logisticJobPlantLocationDataService', ['resourceCommonPlantJobLocationFactory', 'logisticJobDataService',
		function (resourceCommonPlantJobLocationFactory, logisticJobDataService) {

			var configuration = {
				serviceOptions: {
					module: logisticModule,
					name: 'logisticJobPlantLocationDataService',
					translationID: 'logistic.job.entityPlantLocation',
					parentService: logisticJobDataService,
					itemName: 'PlantAllocV'
				},
				filterOptions: {
					name: 'logistic_job_plant_location',
					title: 'logistic.job.plantLocationSettings',
					parentService: null,
					options:
					{
						isForPlant: false,
						isForJob: true
					}
				}
			};
			var factoryOptions = {};//This is passed as a reference to createPlantJobLocationDataService, so
			//settings can be enhanced if necessary to adjust behaviour...
			var serviceContainer = resourceCommonPlantJobLocationFactory.createPlantJobLocationDataService(factoryOptions, configuration);

			return serviceContainer.service;
		}]);
})(angular);
