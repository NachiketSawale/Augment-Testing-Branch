/**
 * Created by waldrop on 6/19/2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'mtwo.controltower';

	/**
	 * @ngdoc controller
	 * @name mtwoControlTowerProDashboardController
	 * @function
	 *
	 * @description
	 * Controller for the grid view of mtwo controltower pro dashboard entities.
	 **/

	angular.module(moduleName).controller('mtwoControlTowerProDashboardController', MtwoControlTowerProDashboardController);

	MtwoControlTowerProDashboardController.$inject = [
		'_',
		'$scope',
		'$injector',
		'platformGridAPI',
		'platformCreateUuid',
		'platformGridControllerService',
		'mtwoControlTowerProDashboardService',
		'mtwoControlTowerProReportsDataService',
		'mtwoControlTowerUIStandardService',
		'mtwoControlTowerValidationService',
		'mtwoControlTowerUserListDataService'];

	function MtwoControlTowerProDashboardController(
		_,
		$scope,
		$injector,
		platformGridAPI,
		platformCreateUuid,
		platformGridControllerService,
		mtwoControlTowerProDashboardService,
		mtwoControlTowerProReportsDataService,
		mtwoControlTowerUIStandardService,
		mtwoControlTowerValidationService,
		mtwoControlTowerUserListDataService) {

		$injector.get('mtwoControlTowerCommonService').setPremiumStatus();

		var myGridConfig = {
			initCalled: false,
			columns: [],
			sortOptions: {
				initialSortColumn: {
					field: 'Name',
					id: 'name' },
				isAsc: true
			},
			cellChangeCallBack: function cellChangeCallBack() {
				mtwoControlTowerProDashboardService.gridRefresh();
			}
		};

		function KillFocus(){
			var grid = platformGridAPI.grids.element('id', $scope.gridId);
			if (grid.instance && grid.dataView) {
				grid.instance.resetActiveCell();
				grid.instance.setSelectedRows([]);
				grid.instance.invalidate();
			}
		}

		mtwoControlTowerProReportsDataService.onRowChange.register(KillFocus);

		$scope.gridId = platformCreateUuid();

		mtwoControlTowerProDashboardService.registerListLoaded(goToFirst);

		function goToFirst(){
			if(!$scope.updatingPackageFromBaseline){
				mtwoControlTowerProDashboardService.goToFirst();
			}
		}

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});

			if(selected){
				var selectedItem = mtwoControlTowerUserListDataService.getSelected();
				var cloudDesktopPowerBIAdalService = $injector.get('cloudDesktopPowerBIAdalService');
				var powerBISettings = cloudDesktopPowerBIAdalService.getPowerBISettings(selectedItem);
				cloudDesktopPowerBIAdalService.acquireTokenAsync(powerBISettings, $scope)
					.then(function(accessToken){
						selected.AccessToken = accessToken;
						mtwoControlTowerProDashboardService.onRowChange.fire(selected);
					});
			}

		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			mtwoControlTowerProReportsDataService.onRowChange.unregister(KillFocus);
		});

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerProDashboardService, mtwoControlTowerValidationService, myGridConfig);

		_.remove($scope.tools.items, function (item) {
			return item.id;
		});
	}
})(angular);
