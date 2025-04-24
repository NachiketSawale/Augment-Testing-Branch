/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateAssignmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant assignment entities
	 **/
	angModule.controller('resourcePlantEstimateAssignmentDetailController', ResourcePlantEstimateAssignmentDetailController);

	ResourcePlantEstimateAssignmentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateAssignmentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd1bbd6ab5c949d998665092a5c583d9');
	}
})();