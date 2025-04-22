/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractBillingService
	 * @function
	 *
	 * @description
	 * salesContractBillingService
	 */
	salesContractModule.factory('salesContractBillingService',
		['_', 'platformDataServiceFactory', 'salesContractService', 'ServiceDataProcessDatesExtension',
			function (_, platformDataServiceFactory, salesContractService, ServiceDataProcessDatesExtension) {

				var salesContractBillingServiceOption = {
					flatLeafItem: {
						module: salesContractModule,
						serviceName: 'salesContractBillingService',
						httpRead: {
							usePostForRead: true, route: globals.webApiBaseUrl + 'sales/billing/', endRead: 'billsByContractId',
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension([
							'BillDate', 'DatePosted', 'PerformedFrom', 'PerformedTo', 'CancellationDate', 'DateEffective', 'DateDiscount', 'DateNetpayable',
							'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'
						])],
						presenter: {
							list: {}
						},
						entityRole: {
							leaf: {itemName: 'Contract', parentService: salesContractService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesContractBillingServiceOption);

				// we don't want create and delete functions
				delete serviceContainer.service.createItem;
				delete serviceContainer.service.deleteItem;

				return serviceContainer.service;

			}]);
})();
