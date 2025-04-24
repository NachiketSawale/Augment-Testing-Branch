// eslint-disable-next-line no-redeclare
/* global angular */
// eslint-disable-next-line no-redeclare
/* global angular,globals,jQuery */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';
	// jshint -W072
	angular.module(moduleName).factory('procurementStockOrderProposalDataService',
		['$injector', 'platformDataServiceFactory', 'procurementStockHeaderDataService', 'basicsLookupdataLookupDescriptorService', 'createOrderProposalActionProcessor',
			'procurementContractHeaderFilterService','PlatformMessenger',
			function ($injector, dataServiceFactory, parentService, lookupDescriptorService, createOrderProposalActionProcessor,
				filterService,PlatformMessenger) {
				// eslint-disable-next-line no-unused-vars
				var selectItem,service = {},serviceContainer;
				// eslint-disable-next-line no-unused-vars
				var isUpdate = false;
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/stock/orderproposal/',
							endRead: 'list',
							initReadData: function initReadData(readData) {
								var parentSelectedId = parentService.getSelected().PrjStockFk;
								var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
								readData.filter = '?prjStockFk=' + contextFk;
							}
						},
						actions: {delete: false, create: false, bulk: false},
						serviceName: 'procurementStockOrderProposalDataService',
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									return data.handleReadSucceeded(readData ? readData : [], data, true);
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'PrjStockOrderProposal',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};
				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				var onFilterLoaded = new PlatformMessenger();
				var onFilterUnLoaded = new PlatformMessenger();
				service.IsUpdate = function () {
					isUpdate = true;

				};
				service.getParentData = function () {
					return parentService.getSelected();
				};
				service.loadData = function () {
					selectItem = service.getSelected();
					service.load();

				};
				var onSelectionChanged = function onSelectionChanged() {
					parentService.update();
				};
				service.registerSelectionChanged(onSelectionChanged);
				// user for reloading items after required  clearprojectstock wizard runed.
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

				// filters register and un-register, it will call by the contract-module.js
				service.registerFilters = function () {
					filterService.registerFilters();
					onFilterLoaded.fire(moduleName);
				};

				// unload filters
				service.unRegisterFilters = function () {
					filterService.unRegisterFilters();
					onFilterUnLoaded.fire(moduleName);
				};

				return service;
			}]);
})(angular, jQuery);