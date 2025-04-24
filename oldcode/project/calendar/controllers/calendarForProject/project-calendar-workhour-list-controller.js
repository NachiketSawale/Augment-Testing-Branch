(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarWorkhourListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarWorkhourListController', ProjectCalendarWorkhourListController);

	ProjectCalendarWorkhourListController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectSubContainerService'];

	function ProjectCalendarWorkhourListController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectSubContainerService) {
		var containerUid = 'f915322c445c4463ab40f8993a800056';

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectSubContainerService.prepareGridConfig(containerUid, $scope, projectCalendarContainerInformationService, true);
		// }

		$scope.gridId = containerUid;
		platformContainerControllerService.initController($scope, moduleName, containerUid);
		$scope.$watch('workHour',  function(){
			if($scope.gridId && $scope.workHour) {
				$scope.updateTools();
			}
		});
	}
})();
