/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantFixedAssetDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant fixed asset entities
	 **/
	angModule.controller('resourceEquipmentPlantFixedAssetDetailController', ResourceEquipmentPlantFixedAssetDetailController);

	ResourceEquipmentPlantFixedAssetDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantFixedAssetDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e85c0d0ed4dd46f2b36f55e9ba8376da');
	}
})();