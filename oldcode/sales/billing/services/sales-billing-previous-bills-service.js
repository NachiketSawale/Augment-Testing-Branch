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
	 * @name salesBillingPreviousBillsService
	 * @function
	 *
	 * @description
	 * salesBillingPredecessorService
	 */
	salesBillingModule.factory('salesBillingPreviousBillsService',
		['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'salesBillingService',
			function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, salesBillingService) {

				var salesBillingPreviousBillsServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingPreviousBillsService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/', endRead: 'previousbills'
						},
						presenter: {
							list: {}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'BilHeaderDto',
							moduleSubModule: 'Sales.Billing'
						})],
						entityRole: {
							leaf: {itemName: 'Bil2bil', parentService: salesBillingService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingPreviousBillsServiceOption);

				// we don't want create and delete functions
				delete serviceContainer.service.createItem;
				delete serviceContainer.service.deleteItem;

				return serviceContainer.service;

			}]);
})();
