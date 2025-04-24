(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationPhaseDateSlotListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningConfigurationPhaseDateSlotDataService',
		'productionplanningConfigurationPhaseDateSlotUIStandardService',
		'productionplanningConfigurationPhaseDateSlotValidationService'];

	function ListController($scope, platformGridControllerService,
	                        dataService,
	                        uiStandardService,
	                        validationService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'PhaseDateSlotList'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
		
	}
})(angular);