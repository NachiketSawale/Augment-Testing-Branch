/**
 * Created by baf on 04.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingReportDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping recording report entities.
	 **/
	angular.module(moduleName).controller('timekeepingRecordingReportDetailController', TimekeepingRecordingReportDetailController);

	TimekeepingRecordingReportDetailController.$inject = ['$scope', 'platformContainerControllerService', 'timekeepingRecordingReportDataService'];

	function TimekeepingRecordingReportDetailController($scope, platformContainerControllerService, timekeepingRecordingReportDataService) {
		platformContainerControllerService.initController($scope, moduleName, '9e6540d3c380465cb8e8c7afa0a2a98a');
		timekeepingRecordingReportDataService.resetBreakContainer();
	}

})(angular);