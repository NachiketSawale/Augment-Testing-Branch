/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantEstimationResourceDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantEstimationResourceDataService', ResourceEquipmentPlantEstimationResourceDataService);

	ResourceEquipmentPlantEstimationResourceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourceEquipmentPlantEstimationLineItemDataService', 'estimateAssembliesResourceServiceFactory'];

	function ResourceEquipmentPlantEstimationResourceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourceEquipmentPlantEstimationLineItemDataService, estimateAssembliesResourceServiceFactory) {

		let options = {
			module: angular.module('resource.equipment'),
			isPlantAssembly: true,
			parent: resourceEquipmentPlantEstimationLineItemDataService,
			serviceName: 'resourceEquipmentPlantEstimationResourceDataService',
			itemName: 'PlantEstimationResource',
			assemblyResourceDynamicUserDefinedColumnService: 'resourceEquipmentResourceDynamicUserDefinedColumnService'
		};

		let serviceContainer = estimateAssembliesResourceServiceFactory.createNewEstAssembliesResourceService(options);
		let service = serviceContainer.service;

		service.createItem = undefined;
		service.canCreate = function canCreate() { return false; };
		service.createChildItem = undefined;
		service.canCreateChild = function canCreate() { return false; };
		service.deleteItem = undefined;
		service.canDelete = function canDelete() { return false; };

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
