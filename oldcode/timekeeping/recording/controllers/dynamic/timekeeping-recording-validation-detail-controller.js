(function () {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingValidationDetailController
	 * @function
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a record
	 **/
	angular.module(moduleName).controller('timekeepingRecordingValidationBelongsToDetailController', TimekeepingRecordingValidationDetailController);

	TimekeepingRecordingValidationDetailController.$inject = ['$scope', 'platformContainerControllerService','timekeepingRecordingContainerInformationService', 'timekeepingRecordingValdationContainerService'];

	function TimekeepingRecordingValidationDetailController($scope, platformContainerControllerService, timekeepingRecordingContainerInformationService, timekeepingRecordingValdationContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!timekeepingRecordingContainerInformationService.hasDynamic(containerUid)) {
			timekeepingRecordingValdationContainerService.prepareDetailConfig(containerUid, $scope, timekeepingRecordingContainerInformationService);
		}
		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();
