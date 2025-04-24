/**
 * Created by shen on 12/15/2021
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPoolJobPlantLocationDataService
	 * @description pprovides methods to access, create and update resource equipment  entities
	 */
	myModule.service('resourceEquipmentPoolJobPlantLocationDataService', ResourceEquipmentPoolJobPlantLocationDataService);

	ResourceEquipmentPoolJobPlantLocationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantDataService','logisticJobLocationDataServiceFactory'];

	function ResourceEquipmentPoolJobPlantLocationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantDataService, logisticJobLocationDataServiceFactory) {
		let self = this;
		let config = {
			serviceName: 'resourceEquipmentPoolJobPlantLocationDataService',
			module: myModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					let selected = resourceEquipmentPlantDataService.getSelected();
					readData.PlantFk = selected.Id;
				},
				endRead: 'listbyparentpaging'
			},
			entityRole:{
				parentService: resourceEquipmentPlantDataService
			},
			presenter: {
				list: {
					enablePaging: true
				}
			}
		};
		let serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'resourceEquipmentPoolJobPlantLocationLayoutService',
			'resource.equipment.plantPoolJobPlantLocationListTitle',
			'resource.equipment.plantListTitle'
		);

		serviceContainer.data.Initialised = true;
		return serviceContainer.service;
	}
})(angular);
