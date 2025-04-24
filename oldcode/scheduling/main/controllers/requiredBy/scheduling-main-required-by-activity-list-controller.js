(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainRequiredByActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('schedulingMainRequiredByActivityListController', SchedulingMainRequiredByActivityListController);

	SchedulingMainRequiredByActivityListController.$inject = ['$scope', 'platformContainerControllerService','schedulingMainContainerInformationService', 'schedulingMainRequiredByActivityContainerService'];

	function SchedulingMainRequiredByActivityListController($scope, platformContainerControllerService, schedulingMainContainerInformationService, schedulingMainRequiredByActivityContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!schedulingMainContainerInformationService.hasDynamic(containerUid)) {
			schedulingMainRequiredByActivityContainerService.prepareGridConfig(containerUid, $scope, schedulingMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();