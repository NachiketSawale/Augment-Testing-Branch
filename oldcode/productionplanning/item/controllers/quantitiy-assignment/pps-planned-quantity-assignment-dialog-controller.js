/**
 * Created by zwz on 08/15/2022.
 */

(function (angular) {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsPlannedQuantitiyAssginmentDialogController', Controller);
	Controller.$inject = ['$scope', '$options', 'ppsPlannedQuantityAssignmentDialogService', 'platformGridAPI', 'ppsPlannedQuantityGridHandler', 'ppsPlannedQuantitiyAssginmentDialogLayoutHandler'];

	function Controller($scope, $options, dialogService, platformGridAPI, gridHandler, layoutHandler) {
		dialogService.initial($scope, $options);
		layoutHandler.appendPropertiesAndMethodsForLayout($scope);

		function onSelectedRowsChanged(e, args) {
			let gridId = args.grid.options.id;
			let selected = gridHandler.getSelectedItem(gridId);
			if (selected) {
				// refresh data of plannedQtyChildGrid
				dialogService.loadChildPlannedQuantities(selected);
			}
			dialogService.refreshSpecification(selected); // refresh specification
		}
		platformGridAPI.events.register($scope.gridOptions.plannedQtyGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);

		function onCellChange(e, args) {
			let col = args.grid.getColumns()[args.cell].field;
			dialogService.markModification(args, col);
		}
		platformGridAPI.events.register($scope.gridOptions.plannedQtyGrid.state, 'onCellChange', onCellChange);

		function onPlannedQtyChildGridSelectedRowsChanged(e, args) {
			let selected = gridHandler.getSelectedItem(args.grid.options.id);
			dialogService.refreshSpecification(selected);
		}
		platformGridAPI.events.register($scope.gridOptions.plannedQtyChildGrid.state, 'onSelectedRowsChanged', onPlannedQtyChildGridSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridOptions.plannedQtyGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridOptions.plannedQtyGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridOptions.plannedQtyChildGrid.state, 'onSelectedRowsChanged', onPlannedQtyChildGridSelectedRowsChanged);
		});

		setTimeout(function () {
			//console.log('resize grids of ppsPlannedQuantityAssignmentDialog for fixing missing layout of grids when reOpening');
			platformGridAPI.grids.resize($scope.gridOptions.plannedQtyGrid.state);
			platformGridAPI.grids.resize($scope.gridOptions.plannedQtyChildGrid.state);
			platformGridAPI.grids.resize($scope.gridOptions.drwComponentGrid.state);
		}, 200);

	}

})(angular);