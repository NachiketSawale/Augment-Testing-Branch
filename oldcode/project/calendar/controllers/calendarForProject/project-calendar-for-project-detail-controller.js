(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarForProjectDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarForProjectDetailController', ProjectCalendarForProjectDetailController);

	ProjectCalendarForProjectDetailController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectContainerService'];

	function ProjectCalendarForProjectDetailController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectContainerService.prepareDetailConfig(containerUid, $scope, projectCalendarContainerInformationService);
		// }

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
