(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentPricelistDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPricelistDataService is the data service for all plants related functionality.
	 */
	const moduleName= 'resource.equipment';
	const resourceModule = angular.module(moduleName);
	resourceModule.service('resourcePlantEstimateEquipmentPricelistDataService', ResourcePlantEstimateEquipmentPricelistDataService);

	ResourcePlantEstimateEquipmentPricelistDataService.$inject = ['_', '$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformDataServiceDataProcessorExtension', 'resourcePlantEstimateEquipmentDataService', 'resourcePlantEstimateConstantValues', 'platformRuntimeDataService', 'platformGridAPI'];

	function ResourcePlantEstimateEquipmentPricelistDataService(_, $http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, platformDataServiceDataProcessorExtension, resourcePlantEstimateEquipmentDataService, resourcePlantEstimateConstantValues, platformRuntimeDataService, platformGridAPI) {
		const self = this;

		const factoryOptions = {
			flatLeafItem: {
				module: resourceModule,
				serviceName: 'resourcePlantEstimateEquipmentPricelistDataService',
				entityNameTranslationID: 'resource.equipment.entityResourcePlantEstimateEquipmentPricelist',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/pricelist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourcePlantEstimateConstantValues.schemes.plantPrices), {processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantPricelist', parentService: resourcePlantEstimateEquipmentDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(factoryOptions, self);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimateEquipmentPricelistValidationService'
		}, resourcePlantEstimateConstantValues.schemes.plantPrices ) );

		function processItem(item) {
			if (item.IsManual === true) {
				for(var i= 1; i <= 6; i++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion'+ i , readonly: false}]);
				}
			} else {
				for(var j= 1; j <= 6; j++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion'+ j , readonly: true}]);
				}
			}
			platformRuntimeDataService.readonly(item, [{field: 'PricePortionSum', readonly: true}]);
		}

		serviceContainer.service.calculatePricelist = function calculatePricelist() {
			var selectedPriceList = serviceContainer.service.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipment/pricelist/calculatePricePortions', selectedPriceList
			).then(function (response) {
				serviceContainer.service.updateClientPriceList(response.data);
				serviceContainer.service.setSelectedEntities(response.data);
				var resourcePlantEstimateEquipmentEurolistDataService = $injector.get('resourcePlantEstimateEquipmentEurolistDataService');
				var selectedPlantEuroListEntities = resourcePlantEstimateEquipmentEurolistDataService.getSelectedEntities();
				resourcePlantEstimateEquipmentEurolistDataService.loadSubItemList();
				resourcePlantEstimateEquipmentEurolistDataService.setSelectedEntities(selectedPlantEuroListEntities);
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
