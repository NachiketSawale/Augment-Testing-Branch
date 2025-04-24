/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAssignmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant assignment entities
	 **/
	angModule.controller('resourceEquipmentPlantAssignmentDetailController', ResourceEquipmentPlantAssignmentDetailController);

	ResourceEquipmentPlantAssignmentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantAssignmentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd1bbd6ab5c949d998665092a5c583d9');
	}
})();