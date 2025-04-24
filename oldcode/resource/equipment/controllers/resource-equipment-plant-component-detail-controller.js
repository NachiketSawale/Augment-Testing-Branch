/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantComponentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant component entities
	 **/
	angModule.controller('resourceEquipmentPlantComponentDetailController', ResourceEquipmentPlantComponentDetailController);

	ResourceEquipmentPlantComponentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPlantComponentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5f0e8f1e8d5142b099cc5fb4aabd26fa');
	}
})();