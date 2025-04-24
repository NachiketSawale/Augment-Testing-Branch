(function () {

	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarWorkdayListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('projectCalendarWorkdayListController', ProjectCalendarWorkdayListController);

	ProjectCalendarWorkdayListController.$inject = ['$scope', 'platformContainerControllerService','projectCalendarContainerInformationService', 'projectCalendarForProjectSubContainerService'];

	function ProjectCalendarWorkdayListController($scope, platformContainerControllerService, projectCalendarContainerInformationService, projectCalendarForProjectSubContainerService) {
		var containerUid = '9c7070fe60f34d27a9a1003bf03d9bac';

		// if(true || !projectCalendarContainerInformationService.hasDynamic(containerUid)) {
		projectCalendarForProjectSubContainerService.prepareGridConfig(containerUid, $scope, projectCalendarContainerInformationService, true);
		// }

		$scope.gridId = containerUid;
		platformContainerControllerService.initController($scope, moduleName, containerUid);
		$scope.$watch('workDay',  function(){
			if($scope.gridId && $scope.workDay) {
				$scope.updateTools();
			}
		});
	}
})();
