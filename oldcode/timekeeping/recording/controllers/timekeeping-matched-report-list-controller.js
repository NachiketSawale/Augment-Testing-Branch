/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('timekeeping.recording').controller('timekeepingMatchedReportListController', ['$scope', '_', '$translate', '$http', 'platformGridAPI','timeKeepingRecordingSideBarWizardService',
		function ($scope, _, $translate, $http, platformGridAPI,timeKeepingRecordingSideBarWizardService) {
			$scope.gridId = '98868b75de734de7a52f92779e8cabfa';
			$scope.gridData = { state: $scope.gridId };
			$scope.reports = timeKeepingRecordingSideBarWizardService.getMatchedReports();
			$scope.reports.forEach((report, index) => {
				if (!report.id) {
					report.id = 'report_' + index + '_' + new Date().getTime(); // Ensuring uniqueness
				}
			});
			var gridConfig = {
				columns: [
					{
						field: 'DueDate',
						formatter: 'dateutc',
						id: 'duedate',
						name: 'DueDate',
						name$tr$: 'timekeeping.recording.bookingDate',
						readonly: true
					},
					{
						field: 'FromTimePartTime',
						formatter: 'decimal',
						id: 'FromTimePartTime',
						name: 'From Time',
						name$tr$: 'timekeeping.recording.fromtimeparttime',
						readonly: true
					},
					{
						field: 'ToTimePartTime',
						formatter: 'decimal',
						id: 'ToTimePartTime',
						name: 'To Time',
						name$tr$: 'timekeeping.recording.totimeparttime',
						readonly: true
					},
					{
						field: 'Duration',
						formatter: 'decimal',
						id: 'Duration',
						name: 'Duration',
						name$tr$: 'timekeeping.common.duration',
						readonly: true
					},
				],
				data: $scope.reports,
				id: $scope.gridId,
				options: {
					autoHeight: false,
					editable: false,
					idProperty: 'id',
					indicator: true,
					tree: false,
					selectable: true,
					multiSelect: false,
					resizeable: true
				}
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.config(gridConfig);
			}
			platformGridAPI.items.data($scope.gridId, $scope.reports);
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}
	]);
})(angular);

