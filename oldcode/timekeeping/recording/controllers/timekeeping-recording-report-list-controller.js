/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingReportListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping recording report entities.
	 **/

	angular.module(moduleName).controller('timekeepingRecordingReportListController', TimekeepingRecordingReportListController);

	TimekeepingRecordingReportListController.$inject = ['$scope', 'platformContainerControllerService', 'timekeepingRecordingReportDataService'];

	function TimekeepingRecordingReportListController($scope, platformContainerControllerService, timekeepingRecordingReportDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'f78bcdebfebc494392a7759e48e6b0ed');

		timekeepingRecordingReportDataService.resetBreakContainer();

		$scope.addTools([
			{
				id: 'showInactive',
				caption: 'Show Inactive',
				type: 'check',
				iconClass: 'tlb-icons ico-emp-report-show-inactive',
				value: false,
				fn: function () {
					timekeepingRecordingReportDataService.showInactiveRecords(this.value);
				},
			}, {
				id: 't5',
				sort: 5,
				caption: 'cloud.common.taskBarDeepCopyRecord',
				type: 'item',
				iconClass: 'tlb-icons ico-copy-paste-deep',
				disabled: function () {
					return false;
				},
				fn: function createDeepCopy() {
					timekeepingRecordingReportDataService.createDeepCopy();
				}
			}
		]);
	}
})(angular);
