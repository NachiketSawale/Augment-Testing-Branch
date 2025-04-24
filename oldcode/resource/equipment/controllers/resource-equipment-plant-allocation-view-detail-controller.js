/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAllocationViewDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details
	 **/
	angModule.controller('resourceEquipmentPlantAllocationViewDetailController', ResourceEquipmentPlantAllocationViewDetailController);

	ResourceEquipmentPlantAllocationViewDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantAllocationViewDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4ab67f61ff25460e9d8fb982e36fd031');
	}
})();