/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingEstimateHeaderDataService
	 * @function
	 *
	 * @description
	 * saleBillingEstimateHeaderDataService is the data service for all estimate related functionality in the module WIP.
	 */
	angular.module(moduleName).factory('salesBillingEstimateHeaderDataService',
		['globals','$q','$http','$log','platformDataServiceFactory','salesBillingService',
			function (globals,$q,$http,$log,platformDataServiceFactory,salesBillingService) {
				var billingLineItemServiceOptions = {
					flatNodeItem: {
						module: module,
						serviceName: 'salesBillingEstimateHeaderDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/header/',
							endRead: 'getlistbybillfk',
							initReadData: initReadData,
							usePostForRead: true
						},
						entityRole: {
							node: {
								itemName: 'EstHeader',
								parentService : salesBillingService
							}
						},
						presenter: {list: {incorporateDataRead: incorporateDataRead}},
						entitySelection: {},
						useItemFilter: true
					}
				};

				function initReadData(readData) {
					var select = salesBillingService.getSelected()||{};
					readData.wipFk = (select.Id||-1);
					return readData;
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(billingLineItemServiceOptions);
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