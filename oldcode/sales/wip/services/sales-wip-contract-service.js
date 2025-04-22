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
	 * @name salesWipContractService
	 * @function
	 *
	 * @description
	 * salesWipContractService
	 */
	salesWipModule.factory('salesWipContractService',
		['globals', '_', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'salesWipService', 'SalesContractDocumentTypeProcessor',
			function (globals, _, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, salesWipService, SalesContractDocumentTypeProcessor) {

				var salesWipContractServiceOption = {
					flatLeafItem: {
						module: salesWipModule,
						serviceName: 'salesWipContractService',
						httpRead: {
							usePostForRead: true, route: globals.webApiBaseUrl + 'sales/contract/', endRead: 'contractsbyWipId',
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesWipService.getSelected(), 'Id');
							}
						},
						dataProcessor: [
							SalesContractDocumentTypeProcessor,
							platformDataServiceProcessDatesBySchemeExtension.createProcessor({
								typeName: 'OrdHeaderDto',
								moduleSubModule: 'Sales.Contract'
							}),
							{  // make readonly
								processItem: function (contract) {
									platformRuntimeDataService.readonly(contract, true);
								}
							}],
						presenter: {
							list: {}
						},
						entityRole: {
							leaf: {itemName: 'Wip2Ord', parentService: salesWipService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesWipContractServiceOption);

				// we don't want create and delete functions
				delete serviceContainer.service.createItem;
				delete serviceContainer.service.deleteItem;

				return serviceContainer.service;
			}]);
})();
