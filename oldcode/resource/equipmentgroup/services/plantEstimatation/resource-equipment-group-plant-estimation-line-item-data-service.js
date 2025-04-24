/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantEstimationLineItemDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupPlantEstimationLineItemDataService', ResourceEquipmentGroupPlantEstimationLineItemDataService);

	ResourceEquipmentGroupPlantEstimationLineItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourceEquipmentGroupPlantGroup2EstimatePriceListDataService',
		'estimateAssembliesServiceFactory', 'resourceEquipmentGroupDataService', 'estimateAssembliesProcessor'];

	function ResourceEquipmentGroupPlantEstimationLineItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourceEquipmentGroupPlantGroup2EstimatePriceListDataService, estimateAssembliesServiceFactory, resourceEquipmentGroupDataService, estimateAssembliesProcessor) {

		const modConf = platformModuleInitialConfigurationService.get('Resource.EquipmentGroup');
		const templInfo = _.find(modConf.container, function(c) { return c.layout === '02580d5adb6b48429302166d9e9ac8c6'; });

		let option = {
			module: angular.module('resource.equipmentgroup'),
			isPlantAssembly: true,
			parent: resourceEquipmentGroupPlantGroup2EstimatePriceListDataService,
			rootParentService: resourceEquipmentGroupDataService,
			serviceName: 'resourceEquipmentGroupPlantEstimationLineItemDataService',
			resourceServiceName: 'resourceEquipmentGroupPlantEstimationResourceDataService',
			resourceContainerId: 'eaa7ef996ed54b3b80f5535354ed1081',
			userDefinedColumServiceName: 'resourceEquipmentGroupDynamicUserDefinedColumnService',
			estimateAssembliesProcessor:estimateAssembliesProcessor,
			httpRead: {
				route: globals.webApiBaseUrl + templInfo.http + '/',
				endRead: 'plantgroupestimation',
				initReadData: function (readData) {
					let selPriceList = resourceEquipmentGroupPlantGroup2EstimatePriceListDataService.getSelected();
					readData.filter = '?plantGroup2EstPriceListFk=' + selPriceList.Id;
				}
			}
		};

		return estimateAssembliesServiceFactory.createNewEstAssemblyListService(option);
	}

})(angular);
