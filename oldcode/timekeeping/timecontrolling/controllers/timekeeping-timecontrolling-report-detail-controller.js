(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingReportDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping timecontrolling report entities.
	 **/
	angular.module(moduleName).controller('timekeepingTimeControllingReportDetailController', TimekeepingTimeControllingReportDetailController);

	TimekeepingTimeControllingReportDetailController.$inject = ['$scope', 'platformContainerControllerService', 'timekeepingTimecontrollingReportDataService'];

	function TimekeepingTimeControllingReportDetailController($scope, platformContainerControllerService, timekeepingTimecontrollingReportDataService) {
		platformContainerControllerService.initController($scope, moduleName, '4d7ec9a6539c447fbbea83b03c00b5d9');
		timekeepingTimecontrollingReportDataService.resetBreakContainer();
	}

})(angular);