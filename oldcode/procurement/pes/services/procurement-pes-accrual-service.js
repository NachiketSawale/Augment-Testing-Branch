/**
 * Created by chi on 1/31/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementPesAccrualDataService', procurementPesAccrualDataService);

	procurementPesAccrualDataService.$inject = ['_', 'globals', 'moment', 'procurementPesHeaderService', 'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceFactory', 'procurementPesCreateAccrualTransactionService','procurementContextService'];

	function procurementPesAccrualDataService(_, globals, moment, procurementPesHeaderService, ServiceDataProcessDatesExtension,
		basicsLookupdataLookupDescriptorService, platformDataServiceFactory, procurementPesCreateAccrualTransactionService, procurementContextService) {
		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'procurementPesAccrualDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pes/accrual/',
					endRead: 'list'
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PesAccrual',
						parentService: procurementPesHeaderService
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


		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = container.service;

		procurementPesCreateAccrualTransactionService.onCreateSuccessed.register(function () {
			var header = procurementPesHeaderService.getSelected();
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
					var found = _.find(transHeaders, { Id: item.CompanyTransaction.CompanyTransheaderFk });
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