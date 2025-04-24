/**
 * Created by lcn on 9/1/2017.
 */
(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialStockService', basicsMaterialStockService);
	basicsMaterialStockService.$inject = ['$injector', '$http', 'platformDataServiceFactory', 'basicsMaterialRecordService', 'platformRuntimeDataService', 'basicsCommonReadOnlyProcessor'];
	function basicsMaterialStockService($injector, $http, platformDataServiceFactory, basicsMaterialRecordService, platformRuntimeDataService, basicsCommonReadOnlyProcessor) {
		var serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialStockService',
				dataProcessor: [{processItem: processItem}],
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/material/material2projectstock/'},
				presenter: {
					list: {
						handleCreateSucceeded: function (newData) {
							var selectedItem = basicsMaterialRecordService.getSelected();
							newData.MaterialCatalogFk = selectedItem.MaterialCatalogFk;
							return newData;
						}
					}
				},
				entityRole: {node: {itemName: 'Material2ProjectStock', parentService: basicsMaterialRecordService}},
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
		var validationService = null;
		var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'basicsMaterialStockUIStandardService',
			readOnlyFields: []
		});
		service.getServiceContainer = getServiceContainer;
		service.gridRefresh = function () {
			serviceContainer.data.dataModified.fire();
		};
		return service;

		// //////////////////////////
		function processItem(item) {
			let fields;
			if (item) {
				if (basicsMaterialRecordService.isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
					return;
				}
				if (!validationService) {
					var temp = $injector.get('basicsMaterialStockValidationService');
					validationService = temp(service);
				}
				if (validationService) {
					validationService.setProjectStockFk(item, item.ProjectStockFk, 'ProjectStockFk');
				}
				fields = [
					{field: 'StockLocationFk', readonly: item.ProjectStockFk ? false : true}
				];
			} else {
				fields = [
					{ field: 'StockLocationFk', readonly: true }
				];

			}
			platformRuntimeDataService.readonly(item, fields);
		}

		function getServiceContainer() {
			return serviceContainer;
		}

	}
})(angular);