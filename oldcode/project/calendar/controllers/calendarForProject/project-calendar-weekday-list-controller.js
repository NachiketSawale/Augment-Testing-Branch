(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarWeekdayListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarWeekdayListController', ProjectCalendarWeekdayForProjectListController);

	ProjectCalendarWeekdayForProjectListController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectSubContainerService'];

	function ProjectCalendarWeekdayForProjectListController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectSubContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectSubContainerService.prepareGridConfig(containerUid, $scope, projectCalendarContainerInformationService);
		// }

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
