(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantComponentDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantComponentDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantComponentDataService', ['resourceEquipmentPlantDataService', 'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantComponentReadOnlyProcessor',
		function (resourceEquipmentPlantDataService, platformDataServiceFactory, platformDataServiceDataProcessorExtension, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantComponentReadOnlyProcessor) {

			var factoryOptions = {
				flatNodeItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantComponentDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantComponent',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plantcomponent/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							},
							incorporateDataRead: function (readData, data) {
								let result = serviceContainer.data.handleReadSucceeded(readData, data);
								// Update the selected item with the first entry from the read data.
								if (readData && readData.length > 0) {
									serviceContainer.service.setSelected(readData[0]);
								}
								return result;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PlantComponentDto',
						moduleSubModule: 'Resource.Equipment'
					}), resourceEquipmentPlantComponentReadOnlyProcessor
					],
					entityRole: {
						node: { itemName:'PlantComponent', parentService: resourceEquipmentPlantDataService}
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
