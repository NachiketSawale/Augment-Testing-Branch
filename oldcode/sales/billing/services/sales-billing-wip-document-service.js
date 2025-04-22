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
	 * @name salesBillingWipDocumentService
	 * @function
	 *
	 * @description
	 * salesBillingWipDocumentService is the data service for billing document functionality.
	 */
	salesBillingModule.factory('salesBillingWipDocumentService',
		['_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesCommonDocumentServiceProvider', 'salesBillingService',
			function (_, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesCommonDocumentServiceProvider, salesBillingService) {

				var serviceOptions = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingWipDocumentService',
						entityNameTranslationID: 'sales.billing.entityWipDocument',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/wip/document/',
							endRead: 'listByBillId',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'DocumentDto',
							moduleSubModule: 'Sales.Wip'
						})],
						actions: {delete: false, create: 'false'},
						presenter: {
							list: {
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
				var docService = salesCommonDocumentServiceProvider.getInstance(serviceContainer);

				docService = serviceContainer.service;

				// make service read only
				docService.isReadonly = function () { return true; }; // for bulk editor (toolbar)

				docService.initialize({
					uploadServiceKey: 'sales-wip-document',
					uploadConfigs: {
						SectionType: 'SalesWipDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canUpload: false,
					canPreview: true
				});

				docService.canUploadFiles = () => { return false; };
				docService.canMultipleUploadFiles = () => { return false; };

				return docService;
			}]);
})();
