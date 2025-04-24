(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingReportListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping timecontrolling report entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeControllingReportListController', TimekeepingTimeControllingReportListController);

	TimekeepingTimeControllingReportListController.$inject = ['$scope', 'platformContainerControllerService','timekeepingTimecontrollingReportDataService'];

	function TimekeepingTimeControllingReportListController($scope, platformContainerControllerService,timekeepingTimecontrollingReportDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'ed78f11aecf14c11be28f8399f4d4590');
		timekeepingTimecontrollingReportDataService.resetBreakContainer();

		$scope.addTools([
			{

				id: 't5',
				sort: 5,
				caption: 'cloud.common.taskBarDeepCopyRecord',
				type: 'item',
				iconClass: 'tlb-icons ico-copy-paste-deep',
				disabled:function () {
					return false;
				},
				fn: function createDeepCopy() {
					timekeepingTimecontrollingReportDataService.createDeepCopy();
				}

	       }
		]);
	}
})(angular);
