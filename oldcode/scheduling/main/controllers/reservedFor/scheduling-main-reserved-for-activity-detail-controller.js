(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainReservedForActivityDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('schedulingMainReservedForActivityDetailController', SchedulingMainReservedForActivityDetailController);

	SchedulingMainReservedForActivityDetailController.$inject = ['$scope', 'platformContainerControllerService','schedulingMainContainerInformationService', 'schedulingMainReservedForActivityContainerService'];

	function SchedulingMainReservedForActivityDetailController($scope, platformContainerControllerService, schedulingMainContainerInformationService, schedulingMainReservedForActivityContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!schedulingMainContainerInformationService.hasDynamic(containerUid)) {
			schedulingMainReservedForActivityContainerService.prepareDetailConfig(containerUid, $scope, schedulingMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();