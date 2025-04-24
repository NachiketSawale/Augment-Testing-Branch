/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateAccessoryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant accessory entities
	 **/
	angModule.controller('resourceEquipmentPlantAccessoryDetailController', ResourcePlantEstimateAccessoryDetailController);

	ResourcePlantEstimateAccessoryDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateAccessoryDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd5a69c4da56845f2b5420016f4fc0de3');
	}
})();