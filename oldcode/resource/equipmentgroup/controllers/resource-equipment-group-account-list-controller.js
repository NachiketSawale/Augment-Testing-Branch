/**
 * Created by baf on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupAccountListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipmentGroup account entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupAccountListController', ResourceEquipmentGroupAccountListController);

	ResourceEquipmentGroupAccountListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupAccountListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '73f7e2eea2a842dca95262d9e8832108');
	}
})(angular);