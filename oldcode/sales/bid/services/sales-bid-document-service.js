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
	 * @name salesBidDocumentService
	 * @function
	 *
	 * @description
	 * salesBidDocumentService is the data service for bid document functionality.
	 */
	salesBidModule.factory('salesBidDocumentService',
		['globals', '_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesCommonDocumentServiceProvider', 'salesBidService',
			function (globals, _, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesCommonDocumentServiceProvider, salesBidService) {

				var serviceOptions = {
					flatLeafItem: {
						module: salesBidModule,
						serviceName: 'salesBidDocumentService',
						entityNameTranslationID: 'sales.bid.entityDocument',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/bid/document/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesBidService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'DocumentDto',
							moduleSubModule: 'Sales.Bid'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () { return !docService.isReadonly(); },
							canDeleteCallBackFunc: function () { return !docService.isReadonly(); }
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(salesBidService.getSelected(), 'Id');
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
							leaf: {itemName: 'Documents', parentService: salesBidService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = salesCommonDocumentServiceProvider.getNewEntityValidator('Sales.Bid');

				var docService = salesCommonDocumentServiceProvider.getInstance(serviceContainer);

				docService = serviceContainer.service; // TODO: check

				docService.initialize({
					uploadServiceKey: 'sales-bid-document',
					uploadConfigs: {
						SectionType: 'SalesBidDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canPreview: true
				});

				docService.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
					return _.get(salesBidService.getSelected(), 'IsReadonlyStatus');
				};

				return docService;
			}]);
})();
