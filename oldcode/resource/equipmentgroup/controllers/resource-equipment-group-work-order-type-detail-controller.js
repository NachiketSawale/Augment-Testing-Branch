/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipmentgroup';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupWorkOrderTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant eurolist entities
	 **/
	angModule.controller('resourceEquipmentGroupWorkOrderTypeDetailController', ResourceEquipmentGroupWorkOrderTypeDetailController);

	ResourceEquipmentGroupWorkOrderTypeDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentGroupWorkOrderTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9355d63a6f0b4b9991f3e1f8532ceb41');
	}
})();