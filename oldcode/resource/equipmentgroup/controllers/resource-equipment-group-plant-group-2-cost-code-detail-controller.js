/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantGroup2CostCodeDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Resource EquipmentGroup PlantGroup2CostCode entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPlantGroup2CostCodeDetailController', ResourceEquipmentGroupPlantGroup2CostCodeDetailController);

	ResourceEquipmentGroupPlantGroup2CostCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupPlantGroup2CostCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c622ef8ecbe34fea947b6f8b439e3d41');
	}
})(angular);