(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantEurolistDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantEurolistDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantEurolistDataService', [
		'resourceEquipmentPlantDataService', 'platformDataServiceFactory','resourceEquipmentPlantEurolistValidationProcessor',
		'platformRuntimeDataService',
		function (
			resourceEquipmentPlantDataService, platformDataServiceFactory, resourceEquipmentPlantEurolistValidationProcessor,
			platformRuntimeDataService
		) {
			let creationDataExtension = {};
			let initCreationDataExtension = function initCreationDataExtension() {
				creationDataExtension = { PKey2: null, PKey3: null};
			};
			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantEurolistDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantEurolist',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/planteurolist/',
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
								angular.extend(creationData, creationDataExtension);
								initCreationDataExtension();
							},
							handleCreateSucceeded: function (response) {
								console.log(response);
							}
						}
					},
					dataProcessor: [
						{
							processItem: function (plantEuroList) {
								var fields = [
									{ field: 'Code', 					         readonly: true},
									{ field: 'Description', 					readonly: true},
									{ field: 'CatalogRecordLowerFk', 		readonly: true},
									{ field: 'CatalogRecordUpperFk', 		readonly: true},
									{ field: 'DepreciationLowerFrom', 		readonly: true},
									{ field: 'DepreciationLowerTo', 			readonly: true},
									{ field: 'DepreciationUpperFrom', 		readonly: true},
									{ field: 'DepreciationUpperTo', 			readonly: true},
									{ field: 'DepreciationPercentFrom', 	readonly: true},
									{ field: 'DepreciationPercentTo', 		readonly: true},
									{ field: 'Depreciation', 					readonly: true},
									{ field: 'RepairUpper', 					readonly: true},
									{ field: 'RepairLower', 					readonly: true},
									{ field: 'RepairPercent', 					readonly: true},
									{ field: 'RepairCalculated', 				readonly: true},
									{ field: 'ReinstallmentLower', 			readonly: true},
									{ field: 'ReinstallmentUpper', 			readonly: true},
									{ field: 'ReinstallmentCalculated', 	readonly: true},
									{ field: 'PriceIndexCalc', 				readonly: true},
									{ field: 'PriceIndexLower', 				readonly: true},
									{ field: 'PriceIndexUpper', 				readonly: true},
									{ field: 'IsExtrapolated', 				readonly: true},
									{ field: 'IsInterpolated', 				readonly: true}
								];
								platformRuntimeDataService.readonly(plantEuroList, fields);
							}
						}
					],
					entityRole: {
						leaf: { itemName:'PlantEurolist', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = resourceEquipmentPlantEurolistValidationProcessor;
			service.SetCreationParameter = function (catalogFk, catalogRecordFk) {
				creationDataExtension.PKey2 = catalogFk;
				creationDataExtension.PKey3 = catalogRecordFk;
			};
			return service;
		}]);
})(angular);
