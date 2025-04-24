(function () {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingValidationListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a recording
	 **/
	angular.module(moduleName).controller('timekeepingRecordingValidationBelongsToListController', TimekeepingRecordingValidationListController);

	TimekeepingRecordingValidationListController.$inject = ['$scope', 'platformContainerControllerService','timekeepingRecordingContainerInformationService', 'timekeepingRecordingValdationContainerService'];

	function TimekeepingRecordingValidationListController($scope, platformContainerControllerService, timekeepingRecordingContainerInformationService, timekeepingRecordingValdationContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!timekeepingRecordingContainerInformationService.hasDynamic(containerUid)) {
			timekeepingRecordingValdationContainerService.prepareGridConfig(containerUid, $scope, timekeepingRecordingContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
