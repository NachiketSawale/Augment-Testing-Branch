/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipDocumentService
	 * @function
	 *
	 * @description
	 * salesWipDocumentService is the data service for wip document functionality.
	 */
	salesWipModule.factory('salesWipDocumentService',
		['globals', '_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesCommonDocumentServiceProvider', 'salesWipService',
			function (globals, _, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesCommonDocumentServiceProvider, salesWipService) {

				var serviceOptions = {
					flatLeafItem: {
						module: salesWipModule,
						serviceName: 'salesWipDocumentService',
						entityNameTranslationID: 'sales.wip.entityDocument',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/wip/document/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesWipService.getSelected(), 'Id');
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'DocumentDto',
							moduleSubModule: 'Sales.Wip'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () { return !docService.isReadonly(); },
							canDeleteCallBackFunc: function () { return !docService.isReadonly(); }
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(salesWipService.getSelected(), 'Id');
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
							leaf: {itemName: 'Documents', parentService: salesWipService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = salesCommonDocumentServiceProvider.getNewEntityValidator('Sales.Wip');

				var docService = salesCommonDocumentServiceProvider.getInstance(serviceContainer);

				docService = serviceContainer.service; // TODO: check

				docService.initialize({
					uploadServiceKey: 'sales-wip-document',
					uploadConfigs: {
						SectionType: 'SalesWipDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canPreview: true
				});

				docService.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
					return _.get(salesWipService.getSelected(), 'IsReadonlyStatus');
				};

				return docService;
			}]);
})();
