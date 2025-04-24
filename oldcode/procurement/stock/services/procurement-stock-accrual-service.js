
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementStockAccrualDataService', procurementStockAccrualDataService);

	procurementStockAccrualDataService.$inject = ['_', 'globals', 'moment', 'procurementStockHeaderDataService', 'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceFactory', 'procurementStockCreateAccrualTransactionService'];

	function procurementStockAccrualDataService(_, globals, moment, procurementStockHeaderDataService, ServiceDataProcessDatesExtension,
		basicsLookupdataLookupDescriptorService, platformDataServiceFactory, procurementStockCreateAccrualTransactionService) {
		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'procurementStockAccrualDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/stock/accrual/',
					endRead: 'list'
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'StockAccrual',
						parentService: procurementStockHeaderDataService
					}
				},
				dataProcessor: [
					new ServiceDataProcessDatesExtension(['DateEffective'])
				],
				actions: {
					create: false,
					delete: false
				}
			}
		};

		var service = platformDataServiceFactory.createNewComplete(serviceOptions).service;

		procurementStockCreateAccrualTransactionService.onCreateSuccessed.register(function () {
			var header = procurementStockHeaderDataService.getSelected();
			if (header) {
				service.load();
			}
		});

		return service;

		// //////////////////////////////////
		function incorporateDataRead(readItems, data) {
			var list = readItems.Main;
			var transHeaders = readItems.TransactionHeader;
			var fields = ['PostingDate', 'VoucherDate'];
			_.forEach(list, function(item){
				if (item.CompanyTransaction) {
					var found = _.find(transHeaders, { Id: item.CompanyTransaction.BasCompanyTransactionFk });
					if (found) {
						item.CompanyTransaction.CompanyTransHeader = found.Description;
					}
					_.forEach(fields, function (field) {
						if (_.get(item.CompanyTransaction, field)) {
							_.set(item.CompanyTransaction, field, moment.utc(_.get(item.CompanyTransaction, field)));
						}
					});
				}
			});

			return data.handleReadSucceeded(list, data, true);
		}
	}
})(angular);