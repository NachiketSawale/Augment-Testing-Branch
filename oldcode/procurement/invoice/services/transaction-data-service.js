(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceTransactionDataService',
		['$translate', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'ServiceDataProcessDatesExtension','procurementContextService', 'procurementCommonHelperService',
			function ($translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessDatesExtension,procurementContextService, procurementCommonHelperService) {
				var serviceContainer;
				var onReadSucceeded = function onReadSucceeded(readData, data) {
					if (readData) {
						angular.forEach(readData, function (item) {
							if (item.PostingType === 'Fixed Asset') {
								item.PostingType = $translate.instant('procurement.invoice.transaction.fixedAsset');
							} else {
								item.PostingType = $translate.instant('procurement.invoice.transaction.gLAccount');
							}
						});
					}
					// lookupDescriptorService.attachData(readData);
					return serviceContainer.data.handleReadSucceeded(readData, data, true);
				};
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'InvTransactionDto',
						moduleSubModule: 'Procurement.Invoice'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						// dataProcessor: [readonlyProcessor],
						serviceName: 'procurementInvoiceTransactionDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/transaction/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor, new ServiceDataProcessDatesExtension(['VoucherDate', 'PostingDate', 'ExternalDate', 'NetDuedate', 'DiscountDuedate', 'DateDeferalStart'])],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'InvTransaction',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						presenter: {
							list: {
								incorporateDataRead: onReadSucceeded
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				new procurementCommonHelperService.addAutoSaveHandlerFunctions(service, serviceContainer);

				service.PisReadonly = function () {
					return parentService.getItemStatus().IsReadOnly;
				};

				return service;
			}]);
})(angular);