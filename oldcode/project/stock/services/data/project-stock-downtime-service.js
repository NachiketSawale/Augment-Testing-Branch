/**
 * Created by lcn on 9/20/2021.
 */
(function () {
	'use strict';
	/* global _ */
	var moduleName = 'project.stock';

	// projectMain2ProjectStockDownTimeDataService
	angular.module(moduleName).factory('projectMain2ProjectStockDownTimeDataService', ['projectStockDownTimeDataService', 'projectStockDataService',
		function (dataService, parentService) {
			return dataService.createService(parentService, 'projectMain2ProjectStockDownTimeDataService');
		}]);


	angular.module(moduleName).factory('projectStockDownTimeDataService', ['_', 'globals', 'platformDataServiceFactory','basicsLookupdataLookupDescriptorService','BasicsCommonDateProcessor',
		function (_, globals, platformDataServiceFactory,basicsLookupdataLookupDescriptorService,BasicsCommonDateProcessor) {
			// create a new data service object
			function constructor(parentService, isReadOnly) {
				var serviceContainer, serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'projectStockDownTimeDataService',
						entityNameTranslationID: 'project.stock.downtimeGridTitle',
						actions: isReadOnly ? {delete: false, create: false} : undefined,
						httpRead: {
							route: globals.webApiBaseUrl + 'project/stock/downtime/',
							endRead: 'list',
							initReadData: function (readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'project/stock/downtime/', endCreate: 'create'
						},
						dataProcessor: [new BasicsCommonDateProcessor(['StartDate','EndDate'])],
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
								itemName: 'ProjectStockDownTime', parentService: parentService
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
