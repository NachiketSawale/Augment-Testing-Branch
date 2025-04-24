/**
 * Created by Sudarshan on 2023-07-11.
 */
(function (angular) {
	'use strict';
	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeAllocationBreakListController
	 * @function
	 *
	 * @description
	 * Controller for the list view
	 **/
	angular.module(moduleName).controller('timekeepingTimeAllocationBreakListController', TimekeepingTimeAllocationBreakListController);

	TimekeepingTimeAllocationBreakListController.$inject = ['$scope', 'platformContainerControllerService','timekeepingTimeallocationContainerInformationService', 'timekeepingTimeAllocationBreakContainerService', 'basicsCommonToolbarExtensionService', '$injector'];

	function TimekeepingTimeAllocationBreakListController($scope, platformContainerControllerService, timekeepingTimeallocationContainerInformationService, timekeepingTimeAllocationBreakContainerService, basicsCommonToolbarExtensionService, $injector) {
		let containerUid = $scope.getContentValue('uuid');

		if(!timekeepingTimeallocationContainerInformationService.hasDynamic(containerUid)) {
			timekeepingTimeAllocationBreakContainerService.prepareGridConfig(containerUid, $scope, timekeepingTimeallocationContainerInformationService);
		}
		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);