/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEstimateResourceValidationService
	 * @description provides validation methods for resource entities
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupEstimateResourceValidationService',
		['estimateAssembliesResourceValidationServiceFactory', 'resourceEquipmentGroupPlantEstimationResourceDataService', 'resourceEquipmentGroupPlantEstimationLineItemDataService',
			function (estimateAssembliesResourceValidationServiceFactory, groupPlantEstimationResourceDataService, groupPlantEstimationLineItemDataService) {

				let service = {};

				let isPrjAssembly = false,
					isPlantAssembly = true;

				service = estimateAssembliesResourceValidationServiceFactory.createEstAssemblyResourceValidationService(groupPlantEstimationResourceDataService, groupPlantEstimationLineItemDataService, isPrjAssembly, isPlantAssembly);

				return service;

			}
		]);

})();
