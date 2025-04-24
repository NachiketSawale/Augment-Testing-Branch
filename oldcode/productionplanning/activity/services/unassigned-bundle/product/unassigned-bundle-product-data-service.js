/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningActivityUnassignedBundleProductDataService', PPSActivityUnassignedBundleProductDataService);

	PPSActivityUnassignedBundleProductDataService.$inject = [
		'productionplanningActivityUnassignedBundleDataService',
		'productionplanningCommonProductDataServiceFactory',
		'basicsLookupdataLookupDescriptorService'];
	function PPSActivityUnassignedBundleProductDataService(parentService,
		dataServiceFactory,
		basicsLookupdataLookupDescriptorService) {
		var serviceContainer;
		var option = {
			flatNodeItem: {
				serviceName: 'productionplanningActivityUnassignedBundleProductDataService',
				httpCRUD : {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customlistbyforeignkey',
					initReadData: function initReadData(readData) {
						let mainItemId = parentService.getSelected().Id || -1;
						readData.filter = `?foreignKey=TrsProductBundleFk&mainItemId=${mainItemId}`;
					}
				},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: parentService,
						parentFilter: 'bundleFk'
					}
				},
				actions: {}
			}
		};

		function incorporateDataRead(readData, data) {
			basicsLookupdataLookupDescriptorService.attachData(readData);
			var result = readData.Main? {
				FilterResult: readData.FilterResult,
				dtos: readData.Main || []
			} : readData;
			return serviceContainer.data.handleReadSucceeded(result, data);
		}

		serviceContainer = dataServiceFactory.createService(option);
		return serviceContainer.service;
	}
})(angular);