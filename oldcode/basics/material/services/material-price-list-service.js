/**
 * Created by chi on 5/26/2017.
 */
(function(angular){
	'use strict';
	/* global globals, _ */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialPriceListService', basicsMaterialPriceListService);
	basicsMaterialPriceListService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsMaterialRecordService', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'basicsCommonReadOnlyProcessor','basicsMaterialCalculationHelper'];
	function basicsMaterialPriceListService($injector, platformDataServiceFactory, basicsMaterialRecordService, basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService, platformRuntimeDataService, basicsCommonReadOnlyProcessor,basicsMaterialCalculationHelper) {
		let roundType=basicsMaterialCalculationHelper.roundingType;
		var serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialPriceListService',
				dataProcessor: [{ processItem: processItem }, {processItem: readonlyProcessItem}],
				entityRole: { node: {itemName: 'MaterialPriceList', parentService: basicsMaterialRecordService}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/material/pricelist/'
				},
				presenter: {
					list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}
				},
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						return !basicsMaterialRecordService.isReadonlyMaterial();
					},
					canDeleteCallBackFunc: function () {
						return !basicsMaterialRecordService.isReadonlyMaterial();
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var validationService = null;
		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsMaterialPriceListUIStandardService',
			readOnlyFields: []
		});
		var filters = [
			{
				key: 'basics-material-price-list-price-version-filter',
				serverSide: true,
				fn: function (item) {
					var material = service.parentService().getSelected();
					// var currentDate = new Date();
					// var validFromDate;
					// var validToDate;
					// if (item.MaterialCatalogFk !== material.MaterialCatalogFk) {
					//     return false;
					// }
					// if (!item.ValidFrom && !item.ValidTo) {
					//     return true;
					// }
					// if (item.ValidFrom && item.ValidTo) {
					//     validFromDate = new Date(item.ValidFrom);
					//     validToDate = new Date(item.ValidTo);
					//     if (currentDate.getTime() >= validFromDate.getTime() && currentDate.getTime() <= validToDate.getTime()) {
					//         return true;
					//     }
					// }
					// else if (item.ValidFrom) {
					//     validFromDate = new Date(item.ValidFrom);
					//     if (currentDate.getTime() >= validFromDate.getTime()) {
					//         return true;
					//     }
					// }
					// else if (item.ValidTo) {
					//     validToDate = new Date(item.ValidTo);
					//     if (currentDate.getTime() <= validToDate.getTime()) {
					//         return true;
					//     }
					// }

					return {
						MaterialCatalogFk: material.MaterialCatalogFk
					};
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		service.calculateCost = calculateCost;
		service.getServiceContainer = getServiceContainer;
		service.setCostPriceGross = setCostPriceGross;
		service.recalculatePriceByPriceGross=recalculatePriceByPriceGross;

		data.newEntityValidator = newEntityValidator();
		return service;
		// //////////////////////////
		function incorporateDataRead(readData, data){
			basicsLookupdataLookupDescriptorService.attachData(readData);
			setCostPriceGross (readData.Main);
			return serviceContainer.data.handleReadSucceeded(readData.Main, data);
		}

		function initCreationData(creationData) {
			var material = basicsMaterialRecordService.getSelected();
			creationData.Id=material.Id;
			creationData.LeadTime=material.LeadTime;
			creationData.MdcTaxCodeFk=material.MdcTaxCodeFk;
			creationData.MinQuantity=material.MinQuantity;
			creationData.SellUnit=material.SellUnit;
		}

		function processItem(item) {
			if (item) {
				if (!validationService) {
					var temp = $injector.get('basicsMaterialPriceListValidationService');
					validationService = temp(service);
				}
				if (validationService) {
					var result = validationService.validateMaterialPriceVersionFk(item, item.MaterialPriceVersionFk, 'MaterialPriceVersionFk', true);
					platformRuntimeDataService.applyValidationResult(result, item, 'MaterialPriceVersionFk');
				}
			}
		}


		function calculateCost(entity, changeDirectly) {
			changeDirectly = changeDirectly || false;
			let cost=entity.ListPrice * (100 - entity.Discount) / 100 + entity.Charges + entity.PriceExtras;
			entity.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,cost);
			entity.EstimatePrice = entity.Cost;
			entity.DayworkRate= entity.Cost;
			setCostPriceGross(entity);
			if (!changeDirectly) {
				service.markItemAsModified(entity);
				service.fireItemModified(entity);
			}
		}

		function recalculatePriceByPriceGross(entity,value){
			var taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('TaxCode'), {Id: entity.TaxCodeFk });
			var vatPercent = taxCode ? taxCode.VatPercent : 0;
			entity.CostPriceGross = value;
			let cost=entity.CostPriceGross * 100 / (100 + vatPercent);
			entity.Cost = basicsMaterialCalculationHelper.round(roundType.Cost,cost);
			let listprice=(entity.Cost - entity.Charges - entity.PriceExtras) * 100 / (100 - entity.Discount);
			entity.ListPrice = basicsMaterialCalculationHelper.round(roundType.ListPrice,listprice);
			entity.EstimatePrice = entity.Cost;
			entity.DayworkRate=entity.Cost;
			service.markItemAsModified(entity);
			service.fireItemModified(entity);
		}

		function getServiceContainer() {
			return serviceContainer;
		}

		function newEntityValidator(){
			return {
				validate: function validate(newItem) {
					if (!validationService) {
						var temp = $injector.get('basicsMaterialPriceListValidationService');
						validationService = temp(service);
					}
					if (validationService) {
						var result = validationService.validateMaterialPriceVersionFk(newItem, newItem.MaterialPriceVersionFk, 'MaterialPriceVersionFk');
						platformRuntimeDataService.applyValidationResult(result, newItem, 'MaterialPriceVersionFk');
					}
				}
			};
		}

		function setCostPriceGross(itemList) {
			if (!_.isArray(itemList)) {
				itemList = [itemList];
			}
			angular.forEach(itemList, function(item) {
				var taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('TaxCode'), {Id: item.TaxCodeFk });
				var vatPercent = taxCode ? taxCode.VatPercent : 0;
				item.CostPriceGross = item.Cost * (100 + vatPercent) / 100;
			});
		}

		function readonlyProcessItem(item) {
			if (!item) {
				return;
			}
			if (basicsMaterialRecordService.isReadonlyMaterial()) {
				readonlyProcessorService.setRowReadonlyFromLayout(item, true);
			}
		}
	}
})(angular);