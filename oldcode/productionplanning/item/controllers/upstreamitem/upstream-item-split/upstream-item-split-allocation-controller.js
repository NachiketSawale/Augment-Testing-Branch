/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemUpstreamItemSplitAllocationController', AllocationController);
	AllocationController.$inject = [
		'$scope',
		'platformGridAPI',
		'productionplanningItemUpstreamItemSplitAllocationService'];

	function AllocationController(
		$scope,
		platformGridAPI,
		allocationService) {

		allocationService.init($scope);

		function onCellChange(e, args) {
			allocationService.updateItem(args.item);
		}

		platformGridAPI.events.register($scope.gridOptions.allocationItemGrid.state, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.allocationItemGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.grids.unregister($scope.gridOptions.allocationItemGrid.state);
			allocationService.clear();
		});

	}
})(angular);