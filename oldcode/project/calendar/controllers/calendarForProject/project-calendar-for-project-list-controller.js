(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarForProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarForProjectListController', ProjectCalendarForProjectListController);

	ProjectCalendarForProjectListController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectContainerService'];

	function ProjectCalendarForProjectListController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectContainerService.prepareGridConfig(containerUid, $scope, projectCalendarContainerInformationService);
		// }

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
