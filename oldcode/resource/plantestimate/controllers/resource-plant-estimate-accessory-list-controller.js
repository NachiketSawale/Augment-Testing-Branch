/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateAccessoryListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant entities.
	 **/
	angModule.controller('resourcePlantEstimateAccessoryListController', ResourcePlantEstimateAccessoryListController);

	ResourcePlantEstimateAccessoryListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateAccessoryListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c8814c5d27b54f60827f48112dc1fc57');
	}
})();