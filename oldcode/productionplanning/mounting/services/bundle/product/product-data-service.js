/**
 * Created by waz on 1/11/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningMountingUnassignedBundleProductDataService', ProductionplanningMountingUnassignedBundleProductDataService);

	ProductionplanningMountingUnassignedBundleProductDataService.$inject = [
		'productionplanningMountingUnassignedBundleDataService',
		'productionplanningCommonProductDataServiceFactory',
		'basicsLookupdataLookupDescriptorService'];
	function ProductionplanningMountingUnassignedBundleProductDataService(parentService,
		dataServiceFactory,
		basicsLookupdataLookupDescriptorService) {
		var serviceContainer;
		var option = {
			flatNodeItem: {
				serviceName: 'productionplanningMountingUnassignedBundleProductDataService', 
				httpCRUD : {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'listbyforeignkey',
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