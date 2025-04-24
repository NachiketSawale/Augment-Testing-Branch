/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupEuroListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipmentGroup euroList entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupEuroListListController', ResourceEquipmentGroupEuroListListController);

	ResourceEquipmentGroupEuroListListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupEuroListListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c686905455cf458fb299c40e0966c5b8');
	}
})(angular);