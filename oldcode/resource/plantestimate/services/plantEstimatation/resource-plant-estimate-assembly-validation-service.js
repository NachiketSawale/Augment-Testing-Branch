/**
 * $Id: resource-equipment-estimate-assembly-validation-service.js 21982 2021-12-10 16:29:21Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateAssemblyValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('resourcePlantEstimateAssemblyValidationService', [
		'estimateAssembliesValidationServiceFactory', 'resourcePlantEstimateLineItemDataService',
		function (estimateAssembliesValidationServiceFactory, resourcePlantEstimateLineItemDataService) {
			let service = estimateAssembliesValidationServiceFactory.createEstAssembliesValidationService(resourcePlantEstimateLineItemDataService);

			return service;
		}
	]);
})();
