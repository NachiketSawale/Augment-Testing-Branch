/**
 * Created by anl on 8/12/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportCreateRouteSelectHeaderController', SelectHeaderController);
	SelectHeaderController.$inject = [
		'$scope',
		'platformGridAPI',
		'transportplanningTransportCreateRouteSelectHeaderService'];

	function SelectHeaderController(
		$scope,
		platformGridAPI,
		selectHeaderService) {

		selectHeaderService.init($scope);

		function onCellChange(e, args) {
			var headers = $scope.gridOptions.headerGrid.dataView.getRows();
			var selectedHeaders = _.filter(headers, function (header) {
				return header.Checked;
			});
			selectHeaderService.updateSelectedHeaders(selectedHeaders);
		}

		platformGridAPI.events.register($scope.gridOptions.headerGrid.state, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.headerGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.grids.unregister($scope.gridOptions.headerGrid.state);
			selectHeaderService.clear();
		});
	}
})(angular);