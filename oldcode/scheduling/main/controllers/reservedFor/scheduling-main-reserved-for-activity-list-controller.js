(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainReservedForActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('schedulingMainReservedForActivityListController', SchedulingMainReservedForActivityListController);

	SchedulingMainReservedForActivityListController.$inject = ['$scope', 'platformContainerControllerService','schedulingMainContainerInformationService', 'schedulingMainReservedForActivityContainerService'];

	function SchedulingMainReservedForActivityListController($scope, platformContainerControllerService, schedulingMainContainerInformationService, schedulingMainReservedForActivityContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!schedulingMainContainerInformationService.hasDynamic(containerUid)) {
			schedulingMainReservedForActivityContainerService.prepareGridConfig(containerUid, $scope, schedulingMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();