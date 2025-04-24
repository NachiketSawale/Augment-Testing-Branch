

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemGroupSelectionController', GroupSelectionController);

	GroupSelectionController.$inject = [
		'_', '$scope', '$http', '$injector',
		'$translate',
		'platformGridAPI',
		'productionplanningItemGroupSelectionService'];

	function GroupSelectionController(
		_, $scope, $http, $injector,
		$translate,
		platformGridAPI,
		groupSelectionService) {

		groupSelectionService.initialize($scope);

		groupSelectionService.registerFilters();

		function onItemCellChange(e, args) {
			groupSelectionService.updateEventSeq();
		}

		function onEventCellChange(e, args){
			var col = args.grid.getColumns()[args.cell].field;
			groupSelectionService.updateEventSeqQuantity(args.item, col);
		}

		platformGridAPI.events.register($scope.gridOptions.itemGrid.state, 'onCellChange', onItemCellChange);
		platformGridAPI.events.register($scope.gridOptions.eventGrid.state, 'onCellChange', onEventCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.itemGrid.state, 'onCellChange', onItemCellChange);
			platformGridAPI.events.register($scope.gridOptions.eventGrid.state, 'onCellChange', onEventCellChange);
			platformGridAPI.grids.unregister($scope.gridOptions.itemGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.eventGrid.state);
			groupSelectionService.unregisterFilters();
		});
	}

})(angular);