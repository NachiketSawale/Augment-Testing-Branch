/**
 * Created by nitsche on 12.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantCostVValidationService
	 * @description provides validation methods for resource equipment  entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantCostVValidationService', resourceEquipmentPlantCostVValidationService);

	resourceEquipmentPlantCostVValidationService.$inject = ['platformDataValidationService', 'resourceEquipmentPlantCostVDataService'];

	function resourceEquipmentPlantCostVValidationService(platformDataValidationService, resourceEquipmentPlantCostVDataService) {
	}

})(angular);
