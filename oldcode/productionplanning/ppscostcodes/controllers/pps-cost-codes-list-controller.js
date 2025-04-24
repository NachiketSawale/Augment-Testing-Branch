(angular => {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName).controller('ppsCostCodesListController', ppsCostCodesListController);

	ppsCostCodesListController.$inject = ['$scope', 'platformGridAPI', 'platformContainerControllerService', 'ppsCostCodesConstantValues', 'ppsCostCodesDataService'];

	function ppsCostCodesListController($scope, platformGridAPI, platformContainerControllerService, ppsCostCodesConstantValues, ppsCostCodesDataService) {
		platformContainerControllerService.initController($scope, moduleName, ppsCostCodesConstantValues.uuid.container.costCodeList);

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		function onCellChange (e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			ppsCostCodesDataService.onPropertyChanged(args.item, field);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);