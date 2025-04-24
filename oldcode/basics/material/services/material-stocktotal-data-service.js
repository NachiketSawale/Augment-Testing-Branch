/**
 * Created by lcn on 4/18/2022.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialStockTotalDataService', basicsMaterialStockTotalDataService);
	basicsMaterialStockTotalDataService.$inject = ['$injector', '$http', 'platformDataServiceFactory', 'basicsMaterialRecordService'];

	function basicsMaterialStockTotalDataService($injector, $http, platformDataServiceFactory, basicsMaterialRecordService) {
		var serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialStockTotalDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/stock/stocktotal/',
					endRead: 'listbyMaterial',
					initReadData: function initReadData(readData) {
						var selectedItem = basicsMaterialRecordService.getSelected();
						readData.filter = '?materialId=' + selectedItem.Id;
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							return data.handleReadSucceeded(readData ? readData : [], data);
						}
					}
				},
				entityRole: {node: {itemName: 'Material2ProjectStockTotal', parentService: basicsMaterialRecordService}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;

		service.getServiceContainer = getServiceContainer;
		service.gridRefresh = function () {
			serviceContainer.data.dataModified.fire();
		};
		return service;

		function getServiceContainer() {
			return serviceContainer;
		}

	}
})(angular);