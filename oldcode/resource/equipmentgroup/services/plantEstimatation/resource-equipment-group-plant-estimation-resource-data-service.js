/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantEstimationResourceDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupPlantEstimationResourceDataService', ResourceEquipmentGroupPlantEstimationResourceDataService);

	ResourceEquipmentGroupPlantEstimationResourceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourceEquipmentGroupPlantEstimationLineItemDataService', 'estimateAssembliesResourceServiceFactory'];

	function ResourceEquipmentGroupPlantEstimationResourceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourceEquipmentGroupPlantEstimationLineItemDataService, estimateAssembliesResourceServiceFactory) {

		let option = {
			module: angular.module('resource.equipmentgroup'),
			isPlantAssembly: true,
			parent: resourceEquipmentGroupPlantEstimationLineItemDataService,
			serviceName: 'resourceEquipmentGroupPlantEstimationResourceDataService',
			itemName: 'PlantEstimationResource',
			assemblyResourceDynamicUserDefinedColumnService: 'resourceEquipmentGroupResourceDynamicUserDefinedColumnService'
		};

		let serviceContainer = estimateAssembliesResourceServiceFactory.createNewEstAssembliesResourceService(option);
		let service = serviceContainer.service;

		function getDataOriginal() {
			return angular.copy(serviceContainer.data.itemListOriginal);
		}

		function getData() {
			return serviceContainer.data;
		}

		service.getDataOriginal = getDataOriginal;
		service.getData = getData;

		return service;
	}
})(angular);
