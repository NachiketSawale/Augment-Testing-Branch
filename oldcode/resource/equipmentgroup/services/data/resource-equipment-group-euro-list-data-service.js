/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEuroListDataService
	 * @description pprovides methods to access, create and update resource equipmentGroup euroList entities
	 */
	myModule.service('resourceEquipmentGroupEuroListDataService', ResourceEquipmentGroupEuroListDataService);

	ResourceEquipmentGroupEuroListDataService.$inject = ['platformRuntimeDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupDataService'];

	function ResourceEquipmentGroupEuroListDataService(platformRuntimeDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceEquipmentGroupDataService) {
		var self = this;
		let creationDataExtension = {};
		let initCreationDataExtension = function initCreationDataExtension() {
			creationDataExtension = { PKey2: null, PKey3: null};
		};
		var resourceEquipmentGroupEuroListServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupEuroListDataService',
				entityNameTranslationID: 'resource.equipmentgroup.euroListEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/eurolist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'EquipmentGroupEurolistDto',
						moduleSubModule: 'Resource.EquipmentGroup'}),
					{
						processItem: function (plantEuroList) {
							var fields = [
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
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
							angular.extend(creationData, creationDataExtension);
							initCreationDataExtension();
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Eurolists', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupEuroListServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EquipmentGroupEurolistDto',
			moduleSubModule: 'Resource.EquipmentGroup',
			validationService: 'resourceEquipmentGroupEuroListValidationService'
		});
		serviceContainer.service.SetCreationParameter = function (catalogFk, catalogRecordFk) {
			creationDataExtension.PKey2 = catalogFk;
			creationDataExtension.PKey3 = catalogRecordFk;
		};
	}
})(angular);
