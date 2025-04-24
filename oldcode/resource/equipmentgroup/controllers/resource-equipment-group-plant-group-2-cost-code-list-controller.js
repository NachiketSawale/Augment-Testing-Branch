/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantGroup2CostCodeListController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Resource EquipmentGroup PlantGroup2CostCode entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPlantGroup2CostCodeListController', ResourceEquipmentGroupPlantGroup2CostCodeListController);

	ResourceEquipmentGroupPlantGroup2CostCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupPlantGroup2CostCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bc1f044294f9419db99e41c2bd14e1bf');
	}
})(angular);