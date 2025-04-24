/**
 * Created by wuj on 11/26/2015.
 */


(function (angular) {
	'use strict';
	/* jshint -W072 */

	angular.module('procurement.package').value('procurementPackageImportWarningGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'WarningMessage',
						field: 'WarningMessage',
						formatter: 'remark',
						name: 'Warning Message',
						name$tr$: 'procurement.package.import.warningMessage',
						width: 400
					}
				]
			};
		}
	});


	angular.module('procurement.package').controller('procurementPackageImportWarningGridController',
		['$scope', '$timeout', 'platformGridAPI', 'procurementPackageImportWaringService', 'procurementPackageImportWarningGridColumns',
			'$translate',
			function ($scope, $timeout, platformGridAPI, dataService, gridColumns, $translate) {

				$scope.gridId = 'EWX33168C7478883BEA20C4F2689DEE0';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: gridColumns.getStandardConfigForListView().columns,
						data: [],
						id: $scope.gridId,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);

					var list = dataService.getList();
					if (list.length > 0) {
						platformGridAPI.items.data($scope.gridId, list);
					}

				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.modalOptions = {
					headerText: $translate.instant('procurement.package.import.warningMessage'),
					footer: {
						Accept: $translate.instant('cloud.common.ok')
					},
					onAccept: close,
					cancel: close
				};
				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister('EWX33168C7478883BEA20C4F2689DEE0');
				});

				function close() {
					$scope.$close(false);
				}
			}
		]);
})(angular);