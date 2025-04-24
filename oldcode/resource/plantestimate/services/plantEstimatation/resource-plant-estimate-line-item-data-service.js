/**
 * $Id: resource-plant-estimate-line-item-data-service.js 93892 2023-09-01 12:37:12Z shen $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateLineItemDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateLineItemDataService', ResourcePlantEstimateLineItemDataServiceFactory);

	ResourcePlantEstimateLineItemDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourcePlantEstimatePriceListDataService',
		'estimateAssembliesServiceFactory', 'resourcePlantEstimateEquipmentDataService', 'estimateAssembliesProcessor'];

	function ResourcePlantEstimateLineItemDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourcePlantEstimatePriceListDataService,
		estimateAssembliesServiceFactory, resourcePlantEstimateEquipmentDataService, estimateAssembliesProcessor) {

		let modConf = platformModuleInitialConfigurationService.get('Resource.Plantestimate');
		let templInfo = _.find(modConf.container, function(c) { return c.layout === '02580d5adb6b48429302166d9e9ac8c6'; });

		let option = {
			module: angular.module(moduleName),
			isPlantAssembly: true,
			parent: resourcePlantEstimatePriceListDataService,
			rootParentService: resourcePlantEstimateEquipmentDataService,
			serviceName: 'resourcePlantEstimateLineItemDataService',
			resourceServiceName: 'resourcePlantEstimateResourceDataService',
			resourceContainerId: 'eaa7ef996ed54b3b80f5535354ed1081',
			userDefinedColumServiceName: 'resourcePlantEstimateResourceDynamicUserDefinedColumnService',
			estimateAssembliesProcessor:estimateAssembliesProcessor,
			assemblyFilterService: 'estimateAssembliesFilterService',
			httpRead: {
				route: globals.webApiBaseUrl + templInfo.http + '/',
				endRead: 'plantestimation',
				initReadData: function (readData) {
					let selPriceList = resourcePlantEstimatePriceListDataService.getSelected();
					readData.filter = '?plant2EstPriceListFk=' + selPriceList.Id;
				}
			}
		};

		const assemblyService = estimateAssembliesServiceFactory.createNewEstAssemblyListService(option);
		assemblyService.createItem = undefined;
		assemblyService.canCreate = function canCreate() { return false; };
		assemblyService.deleteItem = undefined;
		assemblyService.canDelete = function canDelete() { return false; };

		return assemblyService;
	}

})(angular);
