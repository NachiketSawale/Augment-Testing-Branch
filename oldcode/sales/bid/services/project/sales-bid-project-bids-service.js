/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidService
	 * @function
	 *
	 * @description
	 * salesBidProjectBidsService is the data service for project bids Header functionality.
	 */
	salesBidModule.factory('salesBidProjectBidsService', ['globals', '_', '$translate', 'platformDataServiceFactory', 'projectMainService', 'salesBidCreateBidDialogService', 'ServiceDataProcessDatesExtension',
		function (globals, _, $translate, platformDataServiceFactory, projectMainService, salesBidCreateBidDialogService, ServiceDataProcessDatesExtension) {

			// The instance of the main service - to be filled with functionality below
			var salesBidHeaderServiceOptions = {
				flatLeafItem: {
					module: salesBidModule,
					serviceName: 'salesBidService',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/bid/'},
					httpRead: {route: globals.webApiBaseUrl + 'sales/bid/'},
					entityRole: {
						leaf: {
							itemName: 'BidHeader',
							moduleName: 'Sales Bid',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					dataProcessor: [new ServiceDataProcessDatesExtension(['QuoteDate', 'PlannedStart', 'PlannedEnd', 'PriceFixingDate', 'DateEffective',
						'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05',
						'OrdPrbltyLastvalDate'])],
					presenter: {
						list: {}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(salesBidHeaderServiceOptions);

			// create a bid dialog
			serviceContainer.service.createItem = function createBid() {
				salesBidCreateBidDialogService.resetToDefault();
				var selectedProject = projectMainService.getSelected();
				salesBidCreateBidDialogService.init({
					ProjectFk: _.get(selectedProject, 'Id', null),
					CurrencyFk: _.get(selectedProject, 'CurrencyFk', null)
				});
				salesBidCreateBidDialogService.showDialog(function (creationData) {
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}, ['projectfk'] /* readonly rows */);
			};

			return serviceContainer.service;

		}]);
})();
