/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateEurolistListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of eurolist entities.
	 **/
	angModule.controller('resourcePlantEstimateEurolistListController', ResourcePlantEstimateEurolistListController);

	ResourcePlantEstimateEurolistListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateEurolistListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c779f23a59854b0c9c9960044319d8a4');
	}
})();