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
	 * @name salesContractWipService
	 * @function
	 *
	 * @description
	 * salesContractWipService
	 */
	salesContractModule.factory('salesContractWipService',
		['_', 'platformDataServiceFactory', 'salesContractService', 'ServiceDataProcessDatesExtension',
			function (_, platformDataServiceFactory, salesContractService, ServiceDataProcessDatesExtension) {

				var salesContractWipServiceOption = {
					flatLeafItem: {
						module: salesContractModule,
						serviceName: 'salesContractWipService',
						httpRead: {
							usePostForRead: true, route: globals.webApiBaseUrl + 'sales/wip/', endRead: 'wipsByContractId',
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesContractService.getSelected(), 'Id');
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DocumentDate', 'PerformedFrom', 'PerformedTo', 'DateEffective'])],
						presenter: {
							list: {}
						},
						entityRole: {
							leaf: {itemName: 'Contract', parentService: salesContractService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesContractWipServiceOption);

				// we don't want create and delete functions
				delete serviceContainer.service.createItem;
				delete serviceContainer.service.deleteItem;

				return serviceContainer.service;

			}]);
})();
