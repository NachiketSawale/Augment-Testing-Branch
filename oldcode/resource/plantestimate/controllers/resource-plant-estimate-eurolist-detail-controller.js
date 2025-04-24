/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateEurolistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant eurolist entities
	 **/
	angModule.controller('resourcePlantEstimateEurolistDetailController', ResourcePlantEstimateEurolistDetailController);

	ResourcePlantEstimateEurolistDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateEurolistDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2dd482ff9dd043209388b267dd278a83');
	}
})();