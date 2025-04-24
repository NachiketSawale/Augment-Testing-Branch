/**
 * Created by leo on 19.09.2017.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantAccessoryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant accessory entities
	 **/
	angModule.controller('resourceEquipmentPlantAccessoryDetailController', ResourcePlantAccessoryDetailController);

	ResourcePlantAccessoryDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantAccessoryDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd5a69c4da56845f2b5420016f4fc0de3');
	}
})();