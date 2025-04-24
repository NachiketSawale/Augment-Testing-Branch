/**
 * Created by baf on 2021-10-08.
 */
(function (angular) {

	'use strict';
	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeAllocationReportForEmployeeAndPeriodListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('timekeepingTimeAllocationReportForEmployeeAndPeriodListController', TimekeepingTimeAllocationReportForEmployeeAndPeriodListController);

	TimekeepingTimeAllocationReportForEmployeeAndPeriodListController.$inject = ['$scope', 'platformContainerControllerService','timekeepingTimeallocationContainerInformationService', 'timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService', 'basicsCommonToolbarExtensionService', '$injector'];

	function TimekeepingTimeAllocationReportForEmployeeAndPeriodListController($scope, platformContainerControllerService, timekeepingTimeallocationContainerInformationService, timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService, basicsCommonToolbarExtensionService, $injector) {
		let containerUid = $scope.getContentValue('uuid');

		if(!timekeepingTimeallocationContainerInformationService.hasDynamic(containerUid)) {
			timekeepingTimeAllocationReportForEmployeeAndPeriodContainerService.prepareGridConfig(containerUid, $scope, timekeepingTimeallocationContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		let dataService = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService();
		basicsCommonToolbarExtensionService.insertAfter($scope,{
			id: 'createMultiple',
			caption: 'timekeeping.timeallocation.createMultiple',
			type: 'item',
			iconClass: 'tlb-icons ico-create-multiple',
			fn: dataService.createMultiple,
			disabled: function () {
				return !dataService.canCreateMultiple();
			}
		},'create');
		dataService.resetBreakContainer();
	}
})(angular);