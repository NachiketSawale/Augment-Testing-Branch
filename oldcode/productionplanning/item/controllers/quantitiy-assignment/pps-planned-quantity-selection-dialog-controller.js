/**
 * Created by zwz on 08/15/2022.
 */

(function (angular) {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsPlannedQuantitiySelectionDialogController', Controller);
	Controller.$inject = ['$scope', '$options', 'ppsPlannedQuantitySelectionDialogService', 'platformGridAPI'];

	function Controller($scope, $options, dialogService, platformGridAPI) {
		dialogService.initial($scope, $options);

		function onCellChange(e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			if(field === 'AssigningQuantity' || field === 'AssigningQuantityOneUnit'){
				// If a quantity >0 is entered by the user the checkbox should be automatically selected
				if (args.item && args.item.AssigningQuantity > 0) {
					args.item.Checked = true;
					platformGridAPI.grids.refresh($scope.grid.state, true);
				}
			}
		}

		platformGridAPI.events.register($scope.grid.state, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.grid.state, 'onCellChange', onCellChange);
		});

		setTimeout(function () {
			// console.log('resize grid of ppsPlannedQuantitiySelectionDialog');
			platformGridAPI.grids.resize($scope.grid.state);
		}, 200);
	}

})(angular);