/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAllocationViewListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view
	 **/
	angModule.controller('resourceEquipmentPlantAllocationViewListController', ResourceEquipmentPlantAllocationViewListController);

	ResourceEquipmentPlantAllocationViewListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantAllocationViewListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7d12068f91774d119268f8c79e018385');
	}
})();