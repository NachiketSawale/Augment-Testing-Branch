/**
 * Created by chi on 10/21/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonOtherQuoteItemDialogDataService', procurementPriceComparisonOtherQuoteItemDialogDataService);

	procurementPriceComparisonOtherQuoteItemDialogDataService.$inject = ['globals', 'platformDataServiceFactory'];

	function procurementPriceComparisonOtherQuoteItemDialogDataService(globals, platformDataServiceFactory) {

		var serviceCache = {};

		return {
			getService: getService
		};

		// //////////////////////
		function getService(entityType) {
			if (serviceCache[entityType]) {
				return serviceCache[entityType];
			}

			var config = {};

			if (entityType === 'item') {
				config.route = 'procurement/pricecomparison/item/';
				config.endRead = 'getitemsfromothervisiblequotes';
			} else if (entityType === 'boq') {
				config.route = 'procurement/pricecomparison/boq/';
				config.endRead = 'getboqitemsfromothervisiblequotes';
			} else {
				throw new Error('No such entityType is found.');
			}

			var service = createService(config);
			serviceCache[entityType] = service;
			return service;
		}

		function createService(config) {
			var filterParams = {};

			var route = config.route;
			var endRead = config.endRead;
			var serviceOptions = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonOtherQuoteItemDataService',
				httpRead: {
					route: globals.webApiBaseUrl + route,
					endRead: endRead,
					usePostForRead: true,
					initReadData: initReadData
				},
				presenter: {list: {incorporateDataRead: incorporateDataRead}},
				entitySelection: {}
			};

			var containerService = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = containerService.service;
			var data = containerService.data;

			service.loadByFilter = loadByFilter;
			service.clear = clear;

			data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;

			// ////////////////////
			function initReadData(readData) {
				readData = angular.extend(readData, filterParams);
				return readData;
			}

			function incorporateDataRead(readData, data) {
				return data.handleReadSucceeded(readData || [], data);
			}

			function loadByFilter(params) {
				angular.extend(filterParams, params);
				return service.load();
			}

			function clear() {
				data.itemList.length = 0;
			}
		}


	}
})(angular);