/**
 * Created by nitsche on 11.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCostVListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment  entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentPlantCostVListController', resourceEquipmentPlantCostVListController);

	resourceEquipmentPlantCostVListController.$inject = ['$scope', 'platformContainerControllerService'];

	function resourceEquipmentPlantCostVListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c827ac51271d40b2af1ad364afe7c10c');
	}
})(angular);