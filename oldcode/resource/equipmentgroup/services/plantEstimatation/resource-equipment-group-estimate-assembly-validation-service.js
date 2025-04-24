/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEstimateAssemblyValidationService
	 * @description provides validation methods for plant group assembly entities
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupEstimateAssemblyValidationService', [
		'estimateAssembliesValidationServiceFactory', 'resourceEquipmentGroupPlantEstimationLineItemDataService',
		function (estimateAssembliesValidationServiceFactory, resourceEquipmentGroupPlantEstimationLineItemDataService) {

			let service = {};

			service = estimateAssembliesValidationServiceFactory.createEstAssembliesValidationService(resourceEquipmentGroupPlantEstimationLineItemDataService);

			return service;
		}
	]);
})();
