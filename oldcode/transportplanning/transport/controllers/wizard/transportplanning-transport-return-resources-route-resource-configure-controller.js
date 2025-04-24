/**
 * Created by lav on 11/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportReturnResourcesResourceConfigureController', Controller);
	Controller.$inject = [
		'$scope',
		'platformModuleStateService',
		'platformGridAPI',
		'$injector'];

	function Controller($scope,
						platformModuleStateService,
						platformGridAPI,
						$injector) {
		initializeScope();

		function initializeScope() {
			var returnResourcesResourceConfigureService = $injector.get($scope.steps[2].service);
			returnResourcesResourceConfigureService.initialize($scope);
			platformGridAPI.events.register($scope.gridOptions.resourceGrid.state, 'onCellChange', onCellChange);

			$scope.$on('$destroy', function () {
				var modState = platformModuleStateService.state(returnResourcesResourceConfigureService.getModule());
				if (modState.validation && modState.validation.issues) {
					modState.validation.issues.length = 0;//delete all the issues
				}
				platformGridAPI.events.unregister($scope.gridOptions.resourceGrid.state, 'onCellChange', onCellChange);
				platformGridAPI.grids.unregister($scope.gridOptions.jobGrid.state);
				platformGridAPI.grids.unregister($scope.gridOptions.resourceGrid.state);
			});
		}

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'TransportQuantity') {
				args.item.RemainingQuantity = args.item.OrigRemainingQuantity - args.item.TransportQuantity;
				if (args.item.RemainingQuantity > args.item.OrigRemainingQuantity) {
					args.item.RemainingQuantity = args.item.OrigRemainingQuantity;
				}
				platformGridAPI.rows.refreshRow({'gridId': args.grid.id, 'item': args.item});
			}
		}
	}
})(angular);