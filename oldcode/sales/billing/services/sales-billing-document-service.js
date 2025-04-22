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
	 * @name salesBillingDocumentService
	 * @function
	 *
	 * @description
	 * salesBillingDocumentService is the data service for billing document functionality.
	 */
	salesBillingModule.factory('salesBillingDocumentService',
		['_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesCommonDocumentServiceProvider', 'salesBillingService',
			function (_, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesCommonDocumentServiceProvider, salesBillingService) {

				var serviceOptions = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingDocumentService',
						entityNameTranslationID: 'sales.billing.entityDocument',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/billing/document/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'DocumentDto',
							moduleSubModule: 'Sales.Billing'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () { return !docService.isReadonly(); },
							canDeleteCallBackFunc: function () { return !docService.isReadonly(); }
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
								},
								incorporateDataRead: function (readData, data) {
									_.each(readData, function (item) {
										platformRuntimeDataService.readonly(item, docService.isReadonly());
									});
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'Documents', parentService: salesBillingService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = salesCommonDocumentServiceProvider.getNewEntityValidator('Sales.Billing');

				var docService = salesCommonDocumentServiceProvider.getInstance(serviceContainer);

				docService = serviceContainer.service; // TODO: check

				docService.initialize({
					uploadServiceKey: 'sales-billing-document',
					uploadConfigs: {
						SectionType: 'SalesBillingDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canPreview: true
				});

				docService.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
					return _.get(salesBillingService.getSelected(), 'IsReadonlyStatus');
				};

				return docService;
			}]);
})();
