(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name mtwo.MtwoControlTowerDataPineDashboardsGridController
	 * @require $scoep
	 * @description MtwoControlTowerDataPineDashboardsGridController controller for mtwo ControlTower main grid controller
	 *
	 */
	var moduleName = 'mtwo.controltower';
	angular.module(moduleName).controller('mtwoControlTowerDataPineDashboardsGridController', MtwoControlTowerDataPineDashboardsGridController);

	MtwoControlTowerDataPineDashboardsGridController.$inject = [
		'$scope',
		'platformGridAPI',
		'platformCreateUuid',
		'platformGridControllerService',
		'mtwoControlTowerDataPineDashboardsService',
		'mtwoControlTowerDataPineDashboardsUIStandardService',
		'mtwoControlTowerDataPineValidationService'];

	function MtwoControlTowerDataPineDashboardsGridController(
		$scope,
		platformGridAPI,
		platformCreateUuid,
		platformGridControllerService,
		mtwoControlTowerDataPineDashboardsService,
		mtwoControlTowerUIStandardService,
		mtwoControlTowerDataPineValidationService) {

		var myGridConfig = {
			initCalled: false, columns: [], sortOptions: {initialSortColumn: {field: 'Name', id: 'name'}, isAsc: true},
			cellChangeCallBack: function cellChangeCallBack() {
				mtwoControlTowerDataPineDashboardsService.gridRefresh();
			}
		};
		angular.extend(myGridConfig, mtwoControlTowerDataPineDashboardsService.treePresOpt);

		$scope.gridId = $scope.getContainerUUID();

		mtwoControlTowerDataPineDashboardsService.registerListLoaded(goToFirst);

		function goToFirst() {
			if (!$scope.updatingPackageFromBaseline) {
				mtwoControlTowerDataPineDashboardsService.goToFirst();
			}
		}

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
			if (selected !== null) {
				mtwoControlTowerDataPineDashboardsService.onRowChange.fire(selected);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		});

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerDataPineDashboardsService, mtwoControlTowerDataPineValidationService, myGridConfig);
	}
})(angular);
