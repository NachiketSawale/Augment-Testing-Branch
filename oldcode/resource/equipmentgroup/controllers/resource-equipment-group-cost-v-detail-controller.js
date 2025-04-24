/**
 * Created by nitsche on 18.02.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCostVDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment  entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupCostVDetailController', resourceEquipmentGroupCostVDetailController);

	resourceEquipmentGroupCostVDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function resourceEquipmentGroupCostVDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4ed827706c314183bdef73c70c1ac05e');
	}

})(angular);