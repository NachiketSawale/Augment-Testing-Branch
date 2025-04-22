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
	 * @name salesBillingService
	 * @function
	 *
	 * @description
	 * salesBillingProjectBillsService is the data service for project bills Header functionality.
	 */
	salesBillingModule.factory('salesBillingProjectBillsService', ['_', '$translate', 'platformDataServiceFactory', 'projectMainService', 'salesBillingCreateBillDialogService', 'ServiceDataProcessDatesExtension',
		function (_, $translate, platformDataServiceFactory, projectMainService, salesBillingCreateBillDialogService, ServiceDataProcessDatesExtension) {

			// The instance of the main service - to be filled with functionality below
			var salesBillingHeaderServiceOptions = {
				flatLeafItem: {
					module: salesBillingModule,
					serviceName: 'salesBillingService',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/billing/'},
					httpRead: {route: globals.webApiBaseUrl + 'sales/billing/'},
					entityRole: {
						leaf: {
							itemName: 'BilHeader',
							moduleName: 'Sales Billing',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					dataProcessor: [new ServiceDataProcessDatesExtension([
						'BillDate', 'DatePosted', 'PerformedFrom', 'PerformedTo', 'CancellationDate', 'DateEffective', 'DateDiscount', 'DateNetpayable',
						'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'
					])],
					presenter: {
						list: {}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingHeaderServiceOptions);

			// create a bill dialog
			serviceContainer.service.createItem = function createBilling() {
				salesBillingCreateBillDialogService.resetToDefault();
				var selectedProject = projectMainService.getSelected();
				salesBillingCreateBillDialogService.init({
					ProjectFk: _.get(selectedProject, 'Id', null),
					CurrencyFk: _.get(selectedProject, 'CurrencyFk', null)
				});
				salesBillingCreateBillDialogService.showDialog(function (creationData) {
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}, ['projectfk'] /* readonly rows */);
			};

			return serviceContainer.service;

		}]);
})();
