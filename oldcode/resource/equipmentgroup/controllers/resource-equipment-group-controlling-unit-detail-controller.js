/**
 * Created by baf on 02.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupControllingUnitDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipmentGroup controllingUnit entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupControllingUnitDetailController', ResourceEquipmentGroupControllingUnitDetailController);

	ResourceEquipmentGroupControllingUnitDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupControllingUnitDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a2190511a5de424e9f5514ac574ea0eb');
	}

})(angular);