/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantLocation2DataService
	 * @description pprovides methods to access, create and update resource equipment  entities
	 */
	myModule.service('resourceEquipmentPlantLocation2DataService', ResourceEquipmentPlantLocation2DataService);

	ResourceEquipmentPlantLocation2DataService.$inject = [
		'$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantDataService',
		'logisticJobLocationDataServiceFactory'];

	function ResourceEquipmentPlantLocation2DataService(
		$injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantDataService,
		logisticJobLocationDataServiceFactory
	) {
		var self = this;
		var config = {
			serviceName: 'resourceEquipmentPlantLocation2DataService',
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
		var serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'logisticJobPlantLocation2LayoutService',
			'resource.equipment.plantLocation2ListTitle',
			'resource.equipment.plantListTitle'
		);
		return serviceContainer.service;
	}
})(angular);
