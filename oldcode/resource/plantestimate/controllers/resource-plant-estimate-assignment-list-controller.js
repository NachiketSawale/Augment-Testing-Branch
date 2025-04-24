/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateAssignmentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of assignment entities.
	 **/
	angModule.controller('resourcePlantEstimateAssignmentListController', ResourcePlantEstimateAssignmentListController);

	ResourcePlantEstimateAssignmentListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimateAssignmentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd49d6ac8e844f50b8411e50e31caea8');
	}
})();