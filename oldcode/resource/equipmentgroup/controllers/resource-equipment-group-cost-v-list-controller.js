/**
 * Created by nitsche on 18.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCostVListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment  entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupCostVListController', resourceEquipmentGroupCostVListController);

	resourceEquipmentGroupCostVListController.$inject = ['$scope', 'platformContainerControllerService'];

	function resourceEquipmentGroupCostVListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c827ac51271d40b2af1ad364afe7c10c');
	}
})(angular);