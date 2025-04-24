/**
 * Created by lw on 11/10/2021.
 */
(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialPriceVersionToStockListService', basicsMaterialPriceVersionToStockListService);
	basicsMaterialPriceVersionToStockListService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsMaterialStockService', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'basicsCommonReadOnlyProcessor'];
	function basicsMaterialPriceVersionToStockListService($injector, platformDataServiceFactory, basicsMaterialStockService, basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService, platformRuntimeDataService, basicsCommonReadOnlyProcessor) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialPriceVersionToStockListService',
				dataProcessor: [{processItem: processItem}],
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/material/stock2matpricever/'},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead,
						handleCreateSucceeded: function (newData) {
							var selectedItem = basicsMaterialStockService.getSelected();
							newData.PrjStockFk = selectedItem.ProjectStockFk;
							newData.MdcMaterialCatalogFk = selectedItem.MaterialCatalogFk;
							return newData;
						}
					}
				},
				entityRole: {leaf: {itemName: 'Stock2MatPricever', parentService: basicsMaterialStockService}},
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						return !basicsMaterialStockService.parentService().isReadonlyMaterial();
					},
					canDeleteCallBackFunc: function () {
						return !basicsMaterialStockService.parentService().isReadonlyMaterial();
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var validationService = null;
		var filters = [
			{
				key: 'basics-material-price-version-to-stock-list-price-version-filter',
				serverSide: true,
				fn: function (item) {
					var materialStock = service.parentService().getSelected();
					return {
						MaterialCatalogFk: materialStock.MaterialCatalogFk
					};
				}
			}
		];
		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsMaterialPriceVersionToStockListUIStandardService',
			readOnlyFields: []
		});
		basicsLookupdataLookupFilterService.registerFilter(filters);

		service.getServiceContainer = getServiceContainer;
		service.gridRefresh = function () {
			serviceContainer.data.dataModified.fire();
		};
		return service;

		// /////////////////////////
		function incorporateDataRead(readData, data){
			basicsLookupdataLookupDescriptorService.attachData(readData);
			if (angular.isUndefined(readData.Main)) {
				return serviceContainer.data.handleReadSucceeded(readData, data);
			}
			else {
				return serviceContainer.data.handleReadSucceeded(readData.Main, data);
			}
		}

		function processItem(item) {
			if (item) {
				if (basicsMaterialStockService.parentService().isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
					return;
				}
				if (!validationService) {
					var temp = $injector.get('basicsMaterialPriceVersionToStockListValidationService');
					validationService = temp(service);
				}
				if (validationService) {
					var result = validationService.validateMaterialPriceVersionFk(item, item.MdcMatPriceverFk, 'MdcMatPriceverFk', true);
					platformRuntimeDataService.applyValidationResult(result, item, 'MdcMatPriceverFk');
				}
			}
		}

		function getServiceContainer() {
			return serviceContainer;
		}
	}
})(angular);