(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainRequiredByActivityDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('schedulingMainRequiredByActivityDetailController', SchedulingMainRequiredByActivityDetailController);

	SchedulingMainRequiredByActivityDetailController.$inject = ['$scope', 'platformContainerControllerService','schedulingMainContainerInformationService', 'schedulingMainRequiredByActivityContainerService'];

	function SchedulingMainRequiredByActivityDetailController($scope, platformContainerControllerService, schedulingMainContainerInformationService, schedulingMainRequiredByActivityContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!schedulingMainContainerInformationService.hasDynamic(containerUid)) {
			schedulingMainRequiredByActivityContainerService.prepareDetailConfig(containerUid, $scope, schedulingMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();