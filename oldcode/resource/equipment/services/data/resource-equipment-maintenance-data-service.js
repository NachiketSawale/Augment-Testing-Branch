/**
 * Created by baf on 17.11.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentMaintenanceDataService
	 * @description pprovides methods to access, create and update resource equipment maintenance entities
	 */
	myModule.service('resourceEquipmentMaintenanceDataService', ResourceEquipmentMaintenanceDataService);

	ResourceEquipmentMaintenanceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'resourceEquipmentPlantComponentDataService'];

	function ResourceEquipmentMaintenanceDataService(_, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, resourceEquipmentPlantComponentDataService) {
		const self = this;
		let contextSelectedEntity = null;
		let lastSelectedRecordCode = '';

		let resourceEquipmentMaintenanceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentMaintenanceDataService',
				entityNameTranslationID: 'resource.equipment.entityResourceEquipmentMaintenance',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantmaintenance/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantComponentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'MaintenanceDto',
					moduleSubModule: 'Resource.Equipment'
				}), {processItem: processItem}],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantComponentDataService.getSelected();
							creationData.Id = 0;
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.PlantFk;

							if(!_.isNil(contextSelectedEntity) && !_.isNil(contextSelectedEntity.MaintenanceSchemaFk)) {
								creationData.PKey3 = contextSelectedEntity.MaintenanceSchemaFk;
							}
							contextSelectedEntity = null;
						},
						handleCreateSucceeded: function handleCreateSucceeded(newItem, data) {
							// code sequence: if the user selects an existing record as the basis, the code sequence for the new record will increment from that record's base.
							// for example, if the original record's code is 2023-03-19-2, the code for the new record will be 2023-03-19-2-10, the next one will be 2023-03-19-2-20, and so on.
							// however, if the user selects the original record, the code sequence for the new record will restart, starting from 10. For example, if the original record's code is 2023-03-19-2,
							// then the code for the new record will restart from 2023-03-19-2-10.
							if (newItem && newItem.MaintenanceSchemaFk &&  data.itemList.length > 0) {
								let selectedRecordCode = data.selectedItem.Code;
								if (selectedRecordCode !== lastSelectedRecordCode) {
									lastSelectedRecordCode = selectedRecordCode;
								}
								let recordCodeSequenceNumber = parseInt(lastSelectedRecordCode.split('-').pop());
								if(selectedRecordCode.substring(13)){
									newItem.Code = lastSelectedRecordCode.substring(0,12) +  '-' + (recordCodeSequenceNumber+ 10);
								}
								else {
									newItem.Code = selectedRecordCode + '-' + 10;
								}
								lastSelectedRecordCode = newItem.Code;
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Maintenance', parentService: resourceEquipmentPlantComponentDataService}
				}
			}
		};

		function processItem(item) {
			if (item.Version === 0 && !item.MaintenanceSchemaFk) {
				platformRuntimeDataService.readonly(item, [{field: 'IsRecalcPerformance' , readonly: true}]);
			}
		}

		const serviceContainer = platformDataServiceFactory.createService(resourceEquipmentMaintenanceServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.service.createByContext = function createByContext() {
			contextSelectedEntity = serviceContainer.service.getSelected();

			serviceContainer.service.createItem();
		};

	}
})(angular);
