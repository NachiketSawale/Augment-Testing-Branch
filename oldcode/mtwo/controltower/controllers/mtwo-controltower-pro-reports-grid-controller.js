/**
 * Created by waldrop on 6/18/2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'mtwo.controltower';

	/**
	 * @ngdoc controller
	 * @name mtwoControllerProReportsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of mtwo controller proReports entities.
	 **/

	angular.module(moduleName).controller('mtwoControlTowerProReportsListController', MtwoControlTowerProReportsListController);

	MtwoControlTowerProReportsListController.$inject = [
		'_',
		'$scope',
		'$injector',
		'platformGridControllerService',
		'$translate',
		'platformGridAPI',
		'mtwoControlTowerUserListDataService',
		'mtwoControlTowerProReportsDataService',
		'mtwoControlTowerUIStandardService',
		'mtwoControlTowerValidationService'];

	function MtwoControlTowerProReportsListController(
		_,
		$scope,
		$injector,
		platformGridControllerService,
		$translate,
		platformGridAPI,
		mtwoControlTowerUserListDataService,
		mtwoControlTowerProReportsDataService,
		mtwoControlTowerUIStandardService,
		mtwoControlTowerValidationService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			sortOptions: {
				initialSortColumn: {
					field: 'Name',
					id: 'name'
				},
				isAsc: true
			},
			cellChangeCallBack: function cellChangeCallBack() {

				mtwoControlTowerProReportsDataService.gridRefresh();
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

		mtwoControlTowerUserListDataService.onRowChange.register(KillFocus);

		function onSelectedRowsChanged() {
			var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});

			if (selected) {
				var selectedItem = mtwoControlTowerUserListDataService.getSelected();
				var cloudDesktopPowerBIAdalService = $injector.get('cloudDesktopPowerBIAdalService');
				var powerBISettings = cloudDesktopPowerBIAdalService.getPowerBISettings(selectedItem);
				cloudDesktopPowerBIAdalService.acquireTokenAsync(powerBISettings, $scope)
					.then(function (accessToken) {
						selected.AccessToken = accessToken;
						mtwoControlTowerProReportsDataService.onRowChange.fire(selected);
					});
			}
		}

		$scope.gridId = '0375f8eb73ab4de99ea00bb1afc2ba3a';

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerProReportsDataService, mtwoControlTowerValidationService, myGridConfig);

		_.remove($scope.tools.items, function (item) {
			return item.id;
		});

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			mtwoControlTowerUserListDataService.onRowChange.unregister(KillFocus);

		});
	}
})(angular);
