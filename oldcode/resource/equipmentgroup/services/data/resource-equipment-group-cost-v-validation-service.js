/**
 * Created by nitsche on 12.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupCostVValidationService
	 * @description provides validation methods for resource equipment  entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupCostVValidationService', resourceEquipmentGroupCostVValidationService);

	resourceEquipmentGroupCostVValidationService.$inject = ['platformDataValidationService', 'resourceEquipmentGroupCostVDataService'];

	function resourceEquipmentGroupCostVValidationService(platformDataValidationService, resourceEquipmentGroupCostVDataService) {
	}

})(angular);
