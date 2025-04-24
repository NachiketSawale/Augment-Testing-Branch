/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';
	/*global _, angular*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemUpstreamItemSplitSelectionController', UpstreamItemSplitSelectionController);
	UpstreamItemSplitSelectionController.$inject = [
		'$scope', '$translate',
		'platformGridAPI',
		'platformModalService',
		'productionplanningItemUpstreamItemSplitSelectionService'];

	function UpstreamItemSplitSelectionController(
		$scope, $translate,
		platformGridAPI,
		platformModalService,
		selectionService) {

		selectionService.init($scope);

		function onCellChange(e, args) {
			if(selectionService.validateCheckItem(args.item)) {
				var itemGrid = platformGridAPI.grids.element('id', $scope.gridOptions.selectionItemGrid.state);
				if (itemGrid && itemGrid.dataView) {
					var items = itemGrid.dataView.getRows();
					var selectedItems = _.filter(items, function (item) {
						return item.Checked;
					});
					selectionService.updateSelectedItems(selectedItems);
				}
			}
			selectionService.validateAlertItems();
			$scope.alerts = selectionService.getAlerts();
		}

		platformGridAPI.events.register($scope.gridOptions.selectionItemGrid.state, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.selectionItemGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.grids.unregister($scope.gridOptions.selectionItemGrid.state);
			selectionService.clear();
		});
	}
})(angular);