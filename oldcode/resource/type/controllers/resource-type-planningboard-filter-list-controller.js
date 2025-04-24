(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc controller
	 * @name resourceTypePlanningBoardFilterController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource type  planningboard filter entities.
	 **/

	angular.module(moduleName).controller('resourceTypePlanningBoardFilterListController', ResourceTypePlanningBoardFilterListController);

	ResourceTypePlanningBoardFilterListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceTypePlanningBoardFilterListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9a86db998dad47b6bf7e96fe48c6f0b7');
	}
})(angular);