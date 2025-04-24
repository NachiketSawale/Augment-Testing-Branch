/**
 * Created by lav on 11/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportReturnResourcesRouteSettingController', Controller);
	Controller.$inject = [
		'$scope',
		'platformGridAPI',
		'moment',
		'transportplanningTransportReturnResourcesRouteSettingService',
		'basicsLookupdataLookupViewService',
		'ppsUIUtilService'];

	function Controller($scope,
						platformGridAPI,
						moment,
						returnResourcesRouteSettingService,
						basicsLookupdataLookupViewService,
						ppsUIUtilService) {
		initializeScope();

		function initializeScope() {
			$scope.dataView = new basicsLookupdataLookupViewService.LookupDataView();
			$scope.dataView.dataPage.size = 100;
			$scope.dataView.dataPage.enabled = true;
			$scope.searchValueModified = true;
			ppsUIUtilService.supportPage($scope, $scope.dataView);
			returnResourcesRouteSettingService.initialize($scope);
			platformGridAPI.events.register($scope.gridOptions.routeGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridOptions.routeGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.grids.unregister($scope.gridOptions.routeGrid.state);
			});
		}

		function onSelectedRowsChanged(e, args) {
			$scope.routeEntity = returnResourcesRouteSettingService.getSelectedItem(args.grid.options.id);
			if ($scope.routeEntity) {
				$scope.routeEntity.PlannedStart = moment.utc($scope.routeEntity.PlannedStart);
				$scope.routeEntity.PlannedFinish = moment.utc($scope.routeEntity.PlannedFinish);
				$scope.routeEntity.DstWPFk = -1;//force to initialize the lookup
			}
		}
	}
})(angular);