/**
 * $Id: resource-equipment-plant-estimation-resource-data-service.js 21982 2021-12-10 16:29:21Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateResourceDataService
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateResourceDataService', ResourcePlantEstimateResourceDataService);

	ResourcePlantEstimateResourceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformModuleInitialConfigurationService', 'resourcePlantEstimateLineItemDataService', 'estimateAssembliesResourceServiceFactory'];

	function ResourcePlantEstimateResourceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformModuleInitialConfigurationService, resourcePlantEstimateLineItemDataService, estimateAssembliesResourceServiceFactory) {

		let options = {
			module: angular.module('resource.equipment'),
			isPlantAssembly: true,
			parent: resourcePlantEstimateLineItemDataService,
			serviceName: 'resourcePlantEstimateResourceDataService',
			itemName: 'PlantEstimationResource',
			assemblyResourceDynamicUserDefinedColumnService: 'resourcePlantEstimateResourceDynamicUserDefinedColumnService'
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
