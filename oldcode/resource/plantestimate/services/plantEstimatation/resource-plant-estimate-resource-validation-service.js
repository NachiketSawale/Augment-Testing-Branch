/**
 * $Id: resource-equipment-estimate-resource-validation-service.js 22299 2021-12-14 12:26:17Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateResourceValidationService
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('resourcePlantEstimateResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'resourcePlantEstimateResourceDataService', 'resourcePlantEstimateLineItemDataService',
			function (estimateAssembliesResourceValidationServiceFactory, resourcePlantEstimateResourceDataService, resourcePlantEstimateLineItemDataService) {

				let isPrjAssembly = false, isPlantAssembly = true;

				let service = estimateAssembliesResourceValidationServiceFactory.createEstAssemblyResourceValidationService(resourcePlantEstimateResourceDataService, resourcePlantEstimateLineItemDataService, isPrjAssembly, isPlantAssembly);

				return service;
			}
		]);
})();
