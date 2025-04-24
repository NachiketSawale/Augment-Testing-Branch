/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantEstimationLineItemDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantEstimationLineItemDataService', ResourceEquipmentPlantEstimationLineItemDataServiceFactory);

	ResourceEquipmentPlantEstimationLineItemDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourceEquipmentPlant2EstimatePriceListDataService',
		'resourceMasterMainService', 'estimateAssembliesServiceFactory', 'resourceEquipmentPlantDataService', 'estimateAssembliesProcessor'];

	function ResourceEquipmentPlantEstimationLineItemDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourceEquipmentPlant2EstimatePriceListDataService,
		resourceMasterMainService, estimateAssembliesServiceFactory, resourceEquipmentPlantDataService, estimateAssembliesProcessor) {

		let modConf = platformModuleInitialConfigurationService.get('Resource.Equipment');
		let templInfo = _.find(modConf.container, function(c) { return c.layout === '02580d5adb6b48429302166d9e9ac8c6'; });

		let option = {
			module: angular.module('resource.equipment'),
			isPlantAssembly: true,
			parent: resourceEquipmentPlant2EstimatePriceListDataService,
			rootParentService: resourceEquipmentPlantDataService,
			serviceName: 'resourceEquipmentPlantEstimationLineItemDataService',
			resourceServiceName: 'resourceEquipmentPlantEstimationResourceDataService',
			resourceContainerId: 'eaa7ef996ed54b3b80f5535354ed1081',
			userDefinedColumServiceName: 'resourceEquipmentDynamicUserDefinedColumnService',
			estimateAssembliesProcessor:estimateAssembliesProcessor,
			assemblyFilterService: 'estimateAssembliesFilterService',
			httpRead: {
				route: globals.webApiBaseUrl + templInfo.http + '/',
				endRead: 'plantestimation',
				initReadData: function (readData) {
					let selPriceList = resourceEquipmentPlant2EstimatePriceListDataService.getSelected();
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
