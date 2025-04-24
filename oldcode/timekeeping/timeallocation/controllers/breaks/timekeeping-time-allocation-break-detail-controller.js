/**
 * Created by Sudarshan on 2023-07-12.
 */
(function (angular) {

	'use strict';
	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeAllocationBreakDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view
	 **/
	angular.module(moduleName).controller('timekeepingTimeAllocationBreakDetailController', TimekeepingTimeAllocationBreakDetailController);

	TimekeepingTimeAllocationBreakDetailController.$inject = ['$scope', 'platformContainerControllerService','timekeepingTimeallocationContainerInformationService', 'timekeepingTimeAllocationBreakContainerService'];

	function TimekeepingTimeAllocationBreakDetailController($scope, platformContainerControllerService, timekeepingTimeallocationContainerInformationService, timekeepingTimeAllocationBreakContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!timekeepingTimeallocationContainerInformationService.hasDynamic(containerUid)) {
			timekeepingTimeAllocationBreakContainerService.prepareDetailConfig(containerUid, $scope, timekeepingTimeallocationContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);