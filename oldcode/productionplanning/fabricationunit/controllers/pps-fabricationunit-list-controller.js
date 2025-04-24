(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).controller('ppsFabricationunitListController', [
		'$scope', 'platformGridControllerService',
		'ppsFabricationunitDataService', 'ppsFabricationunitUIService',
		'ppsFabricationunitValidationService', 'platformGridAPI',
		'ppsCommonClipboardService',
		function (
			$scope, platformGridControllerService,
			dataService, uiStandardService,
			validationService, platformGridAPI,
			ppsCommonClipboardService) {
			var gridConfig = {
				initCalled: false,
				columns: [],
				type: 'productionplanning.fabricationunit',
				dragDropService: ppsCommonClipboardService,
				pinningContext: true //set to refresh tools when pinningContext changed
			};

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

			var onCellChange = function (e, args) {
				var field = args.grid.getColumns()[args.cell].field;
				dataService.onEntityPropertyChanged(args.item, field);
			};
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			});
		}
	]);
})();