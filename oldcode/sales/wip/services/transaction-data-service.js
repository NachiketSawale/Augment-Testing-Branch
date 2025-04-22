/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('salesWipTransactionDataService',
		['globals', '$translate', 'platformDataServiceFactory', 'salesWipService', 'platformDataServiceProcessDatesBySchemeExtension',
			function (globals, $translate, dataServiceFactory, parentService, platformDataServiceProcessDatesBySchemeExtension) {
				var serviceContainer;
				var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{
						typeName: 'WipTransactionDto',
						moduleSubModule: 'Sales.Wip'
					}
				);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesWipTransactionDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/wip/transaction/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						dataProcessor: [dateProcessor],
						actions: {delete: false, create: false, bulk: false},
						entityRole: {
							node: {
								itemName: 'WipTransaction',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				service.PisReadonly = function () {
					return parentService.getItemStatus().IsReadOnly;
				};

				return service;
			}]);
})(angular);