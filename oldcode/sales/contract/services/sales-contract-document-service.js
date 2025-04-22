/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractDocumentService
	 * @function
	 *
	 * @description
	 * salesContractDocumentService is the data service for contract document functionality.
	 */
	salesContractModule.factory('salesContractDocumentService',
		['_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesCommonDocumentServiceProvider', 'salesContractService',
			function (_, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesCommonDocumentServiceProvider, salesContractService) {

				var serviceOptions = {
					flatLeafItem: {
						module: salesContractModule,
						serviceName: 'salesContractDocumentService',
						entityNameTranslationID: 'sales.contract.entityDocument',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/contract/document/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'DocumentDto',
							moduleSubModule: 'Sales.Contract'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () { return !docService.isReadonly(); },
							canDeleteCallBackFunc: function () { return !docService.isReadonly(); }
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
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
							leaf: {itemName: 'Documents', parentService: salesContractService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = salesCommonDocumentServiceProvider.getNewEntityValidator('Sales.Contract');

				var docService = salesCommonDocumentServiceProvider.getInstance(serviceContainer);

				docService = serviceContainer.service; // TODO: check

				docService.initialize({
					uploadServiceKey: 'sales-contract-document',
					uploadConfigs: {
						SectionType: 'SalesContractDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canPreview: true
				});

				docService.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
					return _.get(salesContractService.getSelected(), 'IsReadonlyStatus');
				};

				return docService;
			}]);
})();
