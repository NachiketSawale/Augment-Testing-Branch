(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantPricelistDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPricelistDataService is the data service for all plants related functionality.
	 */
	const moduleName= 'resource.equipment';
	let resourceModule = angular.module(moduleName);
	resourceModule.service('resourceEquipmentPlantPricelistDataService', ResourceEquipmentPlantPricelistDataService);

	ResourceEquipmentPlantPricelistDataService.$inject = ['_', '$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformDataServiceDataProcessorExtension', 'resourceEquipmentPlantDataService', 'resourceEquipmentConstantValues', 'platformRuntimeDataService'];

	function ResourceEquipmentPlantPricelistDataService(_, $http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, platformDataServiceDataProcessorExtension, resourceEquipmentPlantDataService, resourceEquipmentConstantValues, platformRuntimeDataService) {
		const self = this;

		const factoryOptions = {
			flatLeafItem: {
				module: resourceModule,
				serviceName: 'resourceEquipmentPlantPricelistDataService',
				entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantPricelist',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/pricelist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceEquipmentConstantValues.schemes.plantPrices), {processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantPricelist', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(factoryOptions, self);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			typeName: 'PlantPricelistDto',
			mustValidateFields: true,
			validationService: 'resourceEquipmentPlantPricelistValidationService'
		}, resourceEquipmentConstantValues.schemes.plantPrices ) );

		function processItem(item) {
			if (item.IsManual === true) {
				for(let i= 1; i <= 6; i++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion'+ i , readonly: false}]);
					platformRuntimeDataService.readonly(item, [{field: 'QualityFactor' , readonly: false}]);
				}
			} else {
				for(let j= 1; j <= 6; j++){
					platformRuntimeDataService.readonly(item, [{field: 'PricePortion'+ j , readonly: true}]);
					platformRuntimeDataService.readonly(item, [{field: 'QualityFactor' , readonly: true}]);
				}
			}
			platformRuntimeDataService.readonly(item, [{field: 'PricePortionSum', readonly: true}]);
		}

		serviceContainer.service.calculatePricelist = function calculatePricelist() {
			let selectedPriceList = serviceContainer.service.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipment/pricelist/calculatepriceportions', selectedPriceList
			).then(function (response) {
				serviceContainer.service.updateClientPriceList(response.data);
				serviceContainer.service.setSelectedEntities(response.data);
				let resourceEquipmentPlantEurolistDataService = $injector.get('resourceEquipmentPlantEurolistDataService');
				let selectedPlantEuroListEntities = resourceEquipmentPlantEurolistDataService.getSelectedEntities();
				resourceEquipmentPlantEurolistDataService.loadSubItemList();
				resourceEquipmentPlantEurolistDataService.setSelectedEntities(selectedPlantEuroListEntities);
			});
		};

		serviceContainer.service.updateClientPriceList = function updateClientPriceList(pricelists) {
			let fireListLoaded = false;
			_.forEach(pricelists, function(pricelist) {
				let index = _.findIndex(serviceContainer.data.itemList, function (item) {
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
