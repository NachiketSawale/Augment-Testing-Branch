/**
 * Created by baf on 2021-10-08.
 */
(function (angular) {

	'use strict';
	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeAllocationReportForEmployeeAndPeriodDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of reports to the selected employee and the period of the allocations
	 **/
	angular.module(moduleName).controller('timekeepingTimeAllocationReportForEmployeeAndPeriodDetailController', TimekeepingTimeAllocationReportForEmployeeAndPeriodDetailController);

	TimekeepingTimeAllocationReportForEmployeeAndPeriodDetailController.$inject = ['$scope', '$injector', 'platformContainerControllerService','timekeepingTimeallocationContainerInformationService', 'timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService'];

	function TimekeepingTimeAllocationReportForEmployeeAndPeriodDetailController($scope, $injector, platformContainerControllerService, timekeepingTimeallocationContainerInformationService, timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!timekeepingTimeallocationContainerInformationService.hasDynamic(containerUid)) {
			timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService.prepareDetailConfig(containerUid, $scope, timekeepingTimeallocationContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
		const dataService = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService();
		dataService.resetBreakContainer();
	}
})(angular);