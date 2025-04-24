/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentEstimateResourceValidationService
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('resourceEquipmentEstimateResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'resourceEquipmentPlantEstimationResourceDataService', 'resourceEquipmentPlantEstimationLineItemDataService',
			function (estimateAssembliesResourceValidationServiceFactory, resourceEquipmentPlantEstimationResourceDataService, resourceEquipmentPlantEstimationLineItemDataService) {

				let service = {};

				let isPrjAssembly = false,
					isPlantAssembly = true;

				service = estimateAssembliesResourceValidationServiceFactory.createEstAssemblyResourceValidationService(resourceEquipmentPlantEstimationResourceDataService, resourceEquipmentPlantEstimationLineItemDataService, isPrjAssembly, isPlantAssembly);

				return service;

			}
		]);

})();
