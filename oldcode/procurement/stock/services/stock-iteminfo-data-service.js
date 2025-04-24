
/* global globals,jQuery */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';
	// jshint -W072
	angular.module(moduleName).factory('procurementStockItemInfoDataService',
		['$injector', 'platformDataServiceFactory', 'procurementStockHeaderDataService',
			function ($injector, dataServiceFactory, parentService) {
				let service = {}, serviceContainer;
				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/stock/iteminfo/',
							endRead: 'infolist',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								let selectItem = parentService.getSelected();
								readData.PrjStockIds = [selectItem.Id];
								readData.IsOutstanding = service.isOutStanding;
								readData.IsDelivered = service.isDelivered;
								readData.FromDate = service.startDate;
								readData.ToDate = service.endDate;
							}
						},
						actions: {delete: false, create: false, bulk: false},
						serviceName: 'procurementStockItemInfoDataService',
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									return data.handleReadSucceeded(readData ? readData : [], data);
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'StockItemInfoV',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						translation: {
							uid: 'procurementStockItemInfoDataService',
							title: 'procurement.stock.itemInfoContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'StockItemInfoVDto',
								moduleSubModule: 'Procurement.Stock'
							}
						}
					}
				};
				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;

				service.getParentData = function () {
					return parentService.getSelected();
				};
				service.loadData = function () {
					// selectItem = service.getSelected();
					service.load();
				};
				service.initItemInfoFilter = function (filterData) {
					service.isOutStanding = filterData.isOutStanding;
					service.isDelivered = filterData.isDelivered;
					service.startDate = filterData.startDate;
					service.endDate = filterData.endDate;
				};
				return service;
			}]);
})(angular, jQuery);