(function () {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('ppsPlannedQuantityTreeController', PpsPlannedQuantityTreeController);
	PpsPlannedQuantityTreeController.$inject = ['$scope', 'platformGridAPI', 'platformGridControllerService', 'ppsPlannedQuantityUIStandardService', 'ppsPlannedQuantityDataServiceFactory','ppsPlannedQuantityValidationServiceFactory'];
	function PpsPlannedQuantityTreeController($scope, platformGridAPI, platformGridControllerService, uiStandardService, dataServiceFactory, validationServiceFactory) {
		var gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'PlannedQuantityFk',
			childProp: 'ChildItems',
		};
		var serviceOpt = $scope.getContentValue('serviceOption');
		var dataService = dataServiceFactory.getService(serviceOpt);
		var validationService = validationServiceFactory.getService(dataService);
		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		uiStandardService.handerRowChanged(dataService);
		// register cell changed
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})();