/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPriceListDataService
	 * @description pprovides methods to access, create and update resource equipmentGroup priceList entities
	 */
	myModule.service('resourceEquipmentGroupPriceListDataService', ResourceEquipmentGroupPriceListDataService);

	ResourceEquipmentGroupPriceListDataService.$inject = ['$http', '$injector', 'platformGridAPI', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService', 'platformDataServiceDataProcessorExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupDataService'];

	function ResourceEquipmentGroupPriceListDataService($http, $injector, platformGridAPI, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService, platformDataServiceDataProcessorExtension,
	  basicsCommonMandatoryProcessor, resourceEquipmentGroupDataService) {
		var self = this;
		var processItem = function processItem(item) {
			if (item.IsManual === true) {
				for(var i= 1; i <= 6; i++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion0'+ i , readonly: false}]);
				}
			} else {
				for(var j= 1; j <= 6; j++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion0'+ j , readonly: true}]);
				}
			}
			platformRuntimeDataService.readonly(item, [{field: 'PricePortionSum', readonly: true}]);
		};
		var resourceEquipmentGroupPriceListServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupPriceListDataService',
				entityNameTranslationID: 'resource.equipmentgroup.priceListEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/priceList/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EquipmentGroupPricelistDto',
					moduleSubModule: 'Resource.EquipmentGroup'
				}),{processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Pricelists', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupPriceListServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EquipmentGroupPricelistDto',
			moduleSubModule: 'Resource.EquipmentGroup',
			validationService: 'resourceEquipmentGroupPriceListValidationService'
		});

		serviceContainer.service.gridCommitAndUpdate = function () {
			platformGridAPI.grids.commitAllEdits();
			return resourceEquipmentGroupDataService.update();
		};

		serviceContainer.service.calculatePricelist = function calculatePricelist() {
			var selectedPriceList = serviceContainer.service.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/pricelist/calculatePricePortions', selectedPriceList
			).then(function (response) {
				serviceContainer.service.updateClientPriceList(response.data);
				serviceContainer.service.setSelectedEntities(response.data);
				var resourceEquipmentGroupEuroListDataService = $injector.get('resourceEquipmentGroupEuroListDataService');
				var selectedPlantEuroListEntities = resourceEquipmentGroupEuroListDataService.getSelectedEntities();
				resourceEquipmentGroupEuroListDataService.loadSubItemList();
				resourceEquipmentGroupEuroListDataService.setSelectedEntities(selectedPlantEuroListEntities);
			});
		};

		serviceContainer.service.updateClientPriceList = function updateClientPriceList(pricelists) {
			var fireListLoaded = false;
			_.forEach(pricelists, function(pricelist) {
				var index = _.findIndex(serviceContainer.data.itemList, function (item) {
					return item.Id === pricelist.Id;
				});
				serviceContainer.data.itemList[index] = pricelist;
				if(pricelist.Version === 0) {
					serviceContainer.service.markItemAsModified(pricelist);
				}
				fireListLoaded = true;
			});
			if(fireListLoaded) {
				serviceContainer.data.onDataFilterChanged();
			}
			platformDataServiceDataProcessorExtension.doProcessData(pricelists, serviceContainer.data);
		};
		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};
	}
})(angular);
