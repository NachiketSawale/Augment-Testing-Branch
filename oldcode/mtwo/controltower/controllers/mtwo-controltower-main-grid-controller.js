/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoControlTowerMainGridController
	 * @require $scoep
	 * @description mtwoControlTowerMainGridController controller for mtwo ControlTower main grid controller
	 *
	 */
	var moduleName = 'mtwo.controltower';
	angular.module(moduleName).controller('mtwoControlTowerMainGridController', MtwoControlTowerMainGridController);

	MtwoControlTowerMainGridController.$inject = [
		'$scope',
		'platformGridAPI',
		'platformCreateUuid',
		'platformGridControllerService',
		'mtwoControlTowerMainService',
		'mtwoControlTowerReportsService',
		'mtwoControlTowerUIStandardService',
		'mtwoControlTowerValidationService'];

	function MtwoControlTowerMainGridController(
		$scope,
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
				mtwoControlTowerMainService.gridRefresh();
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

		mtwoControlTowerReportsService.onRowChange.register(KillFocus);

		$scope.gridId = platformCreateUuid();

		mtwoControlTowerMainService.registerListLoaded(goToFirst);

		function goToFirst() {
			if (!$scope.updatingPackageFromBaseline) {
				mtwoControlTowerMainService.goToFirst();
			}
		}

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
			if (selected !== null) {
				mtwoControlTowerMainService.onRowChange.fire(selected);
			}

		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			mtwoControlTowerReportsService.onRowChange.unregister(KillFocus);
		});

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerMainService, mtwoControlTowerValidationService, myGridConfig);
	}
})(angular);
