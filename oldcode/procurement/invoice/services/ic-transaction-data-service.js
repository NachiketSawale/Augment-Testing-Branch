(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceIcTransactionDataService',
		['$translate', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'ServiceDataProcessDatesExtension','procurementContextService',
			function ($translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessDatesExtension,procurementContextService) {
				var serviceContainer;

				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'InvTransactionIcDto',
						moduleSubModule: 'Procurement.Invoice'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInvoiceIcTransactionDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/ictransaction/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor, new ServiceDataProcessDatesExtension(['PostingDate'])],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'InvIcTransaction',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				return service;
			}]);
})(angular);