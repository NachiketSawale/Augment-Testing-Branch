/**
 * Created by lcn on 1/03/2024.
 */
(function () {
	'use strict';
	/* global  _ */
	var moduleName = 'project.stock';

	// projectMain2ProjectStock2ClerkDataService
	angular.module(moduleName).factory('projectMain2ProjectStock2ClerkDataService', ['ProjectStock2ClerkDataService', 'projectStockDataService',
		function (dataService, parentService) {
			return dataService.createService(parentService, 'projectMain2ProjectStock2ClerkDataService');
		}]);


	angular.module(moduleName).factory('ProjectStock2ClerkDataService', ['_', 'globals', 'platformDataServiceFactory','basicsLookupdataLookupDescriptorService','BasicsCommonDateProcessor',
		function (_, globals, platformDataServiceFactory,basicsLookupdataLookupDescriptorService,BasicsCommonDateProcessor) {
			// create a new data service object
			function constructor(parentService, isReadOnly) {
				var serviceContainer, serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'ProjectStock2ClerkDataService',
						entityNameTranslationID: 'project.stock.clerkGridTitle',
						actions: isReadOnly ? {delete: false, create: false} : undefined,
						httpRead: {
							route: globals.webApiBaseUrl + 'project/stock/clerk/',
							endRead: 'list',
							initReadData: function (readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'project/stock/clerk/', endCreate: 'create'
						},
						dataProcessor: [new BasicsCommonDateProcessor(['ValidTo','ValidFrom'])],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = parentService.getSelected().Id;
								},
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									return serviceContainer.data.handleReadSucceeded(readData.Main || readData, data);
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'ProjectStock2Clerk', parentService: parentService
							}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				return serviceContainer.service;
			}

			var serviceCache = {};
			var getService = function getService(parentService, modName) {
				if (!_.has(serviceCache, modName)) {
					serviceCache[modName] = constructor.apply(this, [arguments[0], arguments[2]]);
				}
				return serviceCache[modName];
			};

			return {
				createService: getService
			};
		}]);

})();
