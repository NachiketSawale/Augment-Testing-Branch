(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentProcurementContractsDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentProcurementContractsDataService is the data service for all contracts related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentProcurementContractsDataService', ['resourceEquipmentPlantDataService', 'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantComponentReadOnlyProcessor',
		function (resourceEquipmentPlantDataService, platformDataServiceFactory, platformDataServiceDataProcessorExtension, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantComponentReadOnlyProcessor) {

			var factoryOptions = {
				flatNodeItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentProcurementContractsDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentProcurementContracts',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plantprocurementcontracts/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: false, create: false},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PlantProcurementContractVDto',
						moduleSubModule: 'Resource.Equipment'
					}), resourceEquipmentPlantComponentReadOnlyProcessor
					],
					entityRole: {
						node: { itemName:'PlantProcurementContractV', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.takeOver = function takeOver(item){
				var oldItem = _.find(serviceContainer.data.itemList, {Id: item.Id});

				if (oldItem) {
					serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, item, true, serviceContainer.data);
					platformDataServiceDataProcessorExtension.doProcessItem(oldItem, serviceContainer.data);
				}
			};

			return serviceContainer.service;
		}]);
})(angular);
