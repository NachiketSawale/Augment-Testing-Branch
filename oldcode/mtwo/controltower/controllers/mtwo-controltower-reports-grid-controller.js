/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoControlTowerReportGridController
	 * @require $scoep
	 * @description mtwoControlTowerReportGridController controller for mtwo ControlTower main grid controller
	 *
	 */
	var moduleName = 'mtwo.controltower';
	angular.module(moduleName).controller('mtwoControlTowerReportGridController', MtwoControlTowerReportGridController);

	MtwoControlTowerReportGridController.$inject = [
		'$scope',
		'$translate',
		'platformGridAPI',
		'platformCreateUuid',
		'platformGridControllerService',
		'mtwoControlTowerMainService',
		'mtwoControlTowerReportsService',
		'mtwoControlTowerUIStandardService',
		'mtwoControlTowerValidationService'];

	function MtwoControlTowerReportGridController(
		$scope,
		$translate,
		platformGridAPI,
		platformCreateUuid,
		platformGridControllerService,
		mtwoControlTowerMainService,
		mtwoControlTowerReportsService,
		mtwoControlTowerUIStandardService,
		mtwoControlTowerValidationService) {

		var myGridConfig = {
			initCalled: false, columns: [], sortOptions: {initialSortColumn: {field: 'Name', id: 'name'}, isAsc: true},
			cellChangeCallBack: function cellChangeCallBack() {
				mtwoControlTowerReportsService.gridRefresh();
			}
		};

		function KillFocus() {
			var grid = platformGridAPI.grids.element('id', $scope.gridId);
			if (grid.instance && grid.dataView) {
				grid.instance.resetActiveCell();
				grid.instance.setSelectedRows([]);
				grid.instance.invalidate();
			}
		}

		mtwoControlTowerMainService.onRowChange.register(KillFocus);

		$scope.gridId = platformCreateUuid();

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
			if (selected !== null) {
				mtwoControlTowerReportsService.onRowChange.fire(selected);
			}
		}

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerReportsService, mtwoControlTowerValidationService, myGridConfig);

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			mtwoControlTowerMainService.onRowChange.unregister(KillFocus);
		});


	}
})(angular);
