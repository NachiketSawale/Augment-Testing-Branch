/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePlantDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant entities
	 **/
	angModule.controller('resourcePlantEstimatePlantDetailController', ResourcePlantEstimatePlantDetailController);

	ResourcePlantEstimatePlantDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimatePlantDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '14744d2f5e004676abfefd1329b6beff');
	}
})();