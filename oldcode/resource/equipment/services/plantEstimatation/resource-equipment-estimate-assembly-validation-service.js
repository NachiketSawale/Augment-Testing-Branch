/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentEstimateAssemblyValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('resourceEquipmentEstimateAssemblyValidationService', [
		'estimateAssembliesValidationServiceFactory', 'resourceEquipmentPlantEstimationLineItemDataService',
		function (estimateAssembliesValidationServiceFactory, resourceEquipmentPlantEstimationLineItemDataService) {

			let service = {};

			service = estimateAssembliesValidationServiceFactory.createEstAssembliesValidationService(resourceEquipmentPlantEstimationLineItemDataService);

			return service;
		}
	]);
})();
