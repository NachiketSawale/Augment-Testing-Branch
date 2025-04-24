(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationPlannedQuantitySlotListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService', 'platformGridAPI',
		'productionplanningConfigurationPlannedQuantitySlotDataService',
		'productionplanningConfigurationPlannedQuantitySlotUIStandardService',
		'productionplanningConfigurationPlannedQuantitySlotValidationService'];

	function ListController($scope, platformGridControllerService, platformGridAPI,
		dataService,
		uiStandardService,
		validationService) {
		let gridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		const onCellChange = function (e, args) {
			let field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});

	}
})(angular);