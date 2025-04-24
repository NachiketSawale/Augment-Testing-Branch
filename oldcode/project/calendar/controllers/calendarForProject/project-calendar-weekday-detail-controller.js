(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarWeekdayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarWeekdayDetailController', ProjectCalendarWeekdayForProjectDetailController);

	ProjectCalendarWeekdayForProjectDetailController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectSubContainerService'];

	function ProjectCalendarWeekdayForProjectDetailController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectSubContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectSubContainerService.prepareDetailConfig(containerUid, $scope, projectCalendarContainerInformationService);
		// }

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
