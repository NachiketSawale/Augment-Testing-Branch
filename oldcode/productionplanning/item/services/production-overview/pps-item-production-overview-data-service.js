(function(angular) {
	'use strict';
	/*global globals _*/

	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);
	module.factory('ppsItemProductionOverviewDataService', ppsItemProductionOverviewDataService);

	ppsItemProductionOverviewDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningItemDataService', 'ppsItemProductionOverviewDataProcessor'];

	function ppsItemProductionOverviewDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		parentService, dataProcessor) {
		let service = {};
		let serviceOption = {
			hierarchicalLeafItem: {
				module: module,
				serviceName: 'ppsItemProductionOverviewDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getproductionoverview'
				},
				entityRole: {
					leaf: {
						itemName: 'ProductionOverview',
						parentService: parentService
					}
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						{
							typeName: 'PpsProductionOverviewVDto',
							moduleSubModule: 'ProductionPlanning.Item'
						}), dataProcessor],
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Children',
						incorporateDataRead: function (readData, data) {
							return serviceContainer.data.handleReadSucceeded(readData.dtos, data);
						}
					}
				},
				actions: {},
				translation: {
					uid: 'ppsItemProductionOverviewDataService',
					title: 'productionplanning.item.productionOverview.listTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'PpsProductionOverviewVDto',
						moduleSubModule: 'ProductionPlanning.Item'
					},
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		service = serviceContainer.service;

		return service;
	}
})(angular);