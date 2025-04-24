(function (angular) {

	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypePlanningBoardFilterDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource type planningboard filter entities.
	 **/
	angular.module(moduleName).controller('resourceTypePlanningBoardFilterDetailController', ResourceTypePlanningBoardFilterDetailController);

	ResourceTypePlanningBoardFilterDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypePlanningBoardFilterDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1d92b58b87834e8b825380b75c9ca796');
	}

})(angular);