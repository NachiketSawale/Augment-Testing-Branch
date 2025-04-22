/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingTransactionService
	 * @function
	 *
	 * @description
	 * salesBillingTransactionService main service for handling billing transaction entities
	 */
	salesBillingModule.factory('salesBillingTransactionService',
		['salesBillingService', 'platformDataServiceFactory',
			function (salesBillingService, platformDataServiceFactory) {

				var salesBillingTransactionServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingTransactionService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/transaction/', endRead: 'list'
						},
						presenter: {list: {}},
						actions: {}, // TODO: remove toolbar buttons (create/delete)
						dataProcessor: [],
						entityRole: {
							node: {itemName: 'BilTransaction', parentService: salesBillingService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingTransactionServiceOption);

				serviceContainer.service.PisReadonly = function () {
					return salesBillingService.getItemStatus().IsReadOnly;
				};
				return serviceContainer.service;
			}]);
})();
