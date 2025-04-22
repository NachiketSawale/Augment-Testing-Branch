/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipEstimateHeaderDataService
	 * @function
	 *
	 * @description
	 * salesWipEstimateHeaderDataService is the data service for all estimate related functionality in the module WIP.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('salesWipEstimateHeaderDataService',
		['globals','$q','$http','$log','platformDataServiceFactory','salesWipService',
			function (globals,$q,$http,$log,platformDataServiceFactory,salesWipService) {
				var wipLineItemServiceOptions = {
					flatNodeItem: {
						module: module,
						serviceName: 'salesWipEstimateHeaderDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/header/',
							endRead: 'getlistbywipfk',
							initReadData: initReadData,
							usePostForRead: true
						},
						entityRole: {
							node: {
								itemName: 'EstHeader',
								parentService : salesWipService
							}
						},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						entitySelection: {},
						useItemFilter: true
					}
				};

				function initReadData(readData) {
					var select = salesWipService.getSelected()||{};
					readData.wipFk = (select.Id||-1);
					return readData;
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(wipLineItemServiceOptions);
				var service = serviceContainer.service;

				service.canCreate = service.canDelete = function(){
					return false;
				};

				return service;

				// ///////////////////////////

				function incorporateDataRead(responseData, data) {
					var result = data.handleReadSucceeded(responseData, data);
					service.goToFirst();
					return result;
				}
			}]);

})(angular);