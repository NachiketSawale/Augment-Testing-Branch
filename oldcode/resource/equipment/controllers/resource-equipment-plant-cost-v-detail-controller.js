/**
 * Created by nitsche on 11.02.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCostVDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment  entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentPlantCostVDetailController', resourceEquipmentPlantCostVDetailController);

	resourceEquipmentPlantCostVDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function resourceEquipmentPlantCostVDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4ed827706c314183bdef73c70c1ac05e');
	}

})(angular);