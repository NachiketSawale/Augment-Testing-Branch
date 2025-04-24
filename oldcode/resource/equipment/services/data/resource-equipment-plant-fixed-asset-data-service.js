(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantFixedAssetDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantFixedAssetDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantFixedAssetDataService', ['$http', 'platformRuntimeDataService', 'resourceEquipmentPlantDataService', 'platformDataServiceFactory','resourceEquipmentPlantFixedAssetValidationProcessor',
		function ($http, platformRuntimeDataService, resourceEquipmentPlantDataService, platformDataServiceFactory, resourceEquipmentPlantFixedAssetValidationProcessor) {
			var processItem = function processItem(item) {
				platformRuntimeDataService.readonly(item, [{field: 'Code' , readonly: true}]);
				platformRuntimeDataService.readonly(item, [{field: 'Description', readonly: true}]);
				platformRuntimeDataService.readonly(item, [{field: 'CompanyFk', readonly: true}]);
			};

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantFixedAssetDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantFixedAsset',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plantfixedasset/',
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
							}
						}
					},
					dataProcessor: [{processItem:processItem}],
					entityRole: {
						leaf: { itemName:'PlantFixedAsset', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;

			serviceContainer.service.asyncGetCustomizeFixedAsset = function asyncGetCustomizeFixedAsset (id) {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/EquipmentFixedAsset/instance',{Id:id}).then(function (result) {
					return result.data;
				});
			};

			serviceContainer.data.newEntityValidator = resourceEquipmentPlantFixedAssetValidationProcessor;
			return service;
		}]);
})(angular);
