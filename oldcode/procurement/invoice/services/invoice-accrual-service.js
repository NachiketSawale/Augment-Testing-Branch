/**
 * Created by alm on 1/25/2022.
 */

(function () {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementInvoiceAccrualDataService', ['globals', '_', '$http', '$injector', 'moment',
		'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		'procurementInvoiceHeaderDataService', 'procurementInvoiceCreateAccrualTransactionService',
		function (globals, _, $http, $injector, moment, PlatformMessenger,
			platformGridAPI, platformDataServiceFactory, ServiceDataProcessDatesExtension,
			mainDataService, procurementInvoiceCreateAccrualTransactionService) {

			var serviceOptions = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementInvoiceAccrualDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/invoice/accrual/',
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'CompanyTransaction',
							parentService: mainDataService
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DateEffective'])
					],
					actions: {
						delete: false,
						create: false
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = container.service;

			procurementInvoiceCreateAccrualTransactionService.onCreateSuccessed.register(function () {
				var header = mainDataService.getSelected();
				if (header) {
					service.load();
				}
			});

			return service;

			function incorporateDataRead(readItems, data) {
				const { Main: list, TransactionHeader: transHeaders } = readItems;
				const fields = ['PostingDate', 'VoucherDate'];

				_.forEach(list, (item) => {
					const { CompanyTransaction } = item;

					if (CompanyTransaction) {
						const found = _.find(transHeaders, { Id: CompanyTransaction.CompanyTransheaderFk });
						if (found) {
							CompanyTransaction.CompanyTransHeader = found.Description;
						}

						fields.forEach((field) => {
							if (CompanyTransaction[field]) {
								CompanyTransaction[field] = moment.utc(CompanyTransaction[field]);
							}
						});
					}
				});

				return data.handleReadSucceeded(list, data, true);
			}


		}]);
})();
