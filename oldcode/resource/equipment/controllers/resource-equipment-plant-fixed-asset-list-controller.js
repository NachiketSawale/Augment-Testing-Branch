/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantFixedAssetListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant fixed asset entities.
	 **/
	angModule.controller('resourceEquipmentPlantFixedAssetListController', ResourceEquipmentPlantFixedAssetListController);

	ResourceEquipmentPlantFixedAssetListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantFixedAssetListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b46a50394062485b9c0f5ddabf9a1b01');
	}
})();