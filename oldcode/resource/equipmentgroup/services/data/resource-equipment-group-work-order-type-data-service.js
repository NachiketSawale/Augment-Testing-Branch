(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupWorkOrderTypeDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupWorkOrderTypeDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipmentgroup';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentGroupWorkOrderTypeDataService', ['resourceEquipmentGroupDataService', 'platformDataServiceFactory','resourceEquipmentGroupWorkOrderTypeValidationProcessor',
		function (resourceEquipmentGroupDataService, platformDataServiceFactory, resourceEquipmentGroupWorkOrderTypeValidationProcessor) {

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentGroupWorkOrderTypeDataService',
					entityNameTranslationID: 'resource.equipmentgroup.workOrderType',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipmentgroup/workordertype/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentGroupDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentGroupDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName:'WorkOrderTypes', parentService: resourceEquipmentGroupDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = resourceEquipmentGroupWorkOrderTypeValidationProcessor;
			return service;
		}]);
})(angular);
