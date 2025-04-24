/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAssignmentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of assignment entities.
	 **/
	angModule.controller('resourceEquipmentPlantAssignmentListController', ResourceEquipmentPlantAssignmentListController);

	ResourceEquipmentPlantAssignmentListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantAssignmentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd49d6ac8e844f50b8411e50e31caea8');
	}
})();