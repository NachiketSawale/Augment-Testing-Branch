/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantLocationDataService
	 * @description pprovides methods to access, create and update resource equipment  entities
	 */
	myModule.service('resourceEquipmentGroupPlantLocationDataService', ResourceEquipmentGroupPlantLocationDataService);

	ResourceEquipmentGroupPlantLocationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentGroupDataService', 'logisticJobLocationDataServiceFactory'];

	function ResourceEquipmentGroupPlantLocationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentGroupDataService, logisticJobLocationDataServiceFactory) {
		var self = this;
		var config = {
			serviceName: 'resourceEquipmentGroupPlantLocationDataService',
			module: myModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					var selected = resourceEquipmentGroupDataService.getSelected();
					readData.PlantGroupFk = selected.Id;
				},
				endRead: 'listbyparentpaging'
			},
			entityRole:{
				parentService: resourceEquipmentGroupDataService
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
			'resourceEquipmentGroupPlantLocationLayoutService',
			'resource.equipmentgroup.plantLocationListTitle',
			'resource.equipmentgroup.equipmentGroupListTitle'
		);
		serviceContainer.data.Initialised = true;
		return serviceContainer.service;
	}
})(angular);
