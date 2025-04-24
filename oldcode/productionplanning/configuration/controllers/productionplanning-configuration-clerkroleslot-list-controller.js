(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationClerkRoleSlotListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningConfigurationClerkRoleSlotDataService',
		'productionplanningConfigurationClerkRoleSlotUIStandardService',
		'productionplanningConfigurationClerkRoleSlotValidationService'];

	function ListController($scope, platformGridControllerService,
	                        dataService,
	                        uiStandardService,
	                        validationService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'ClerkSlotSlotList'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
	}
})(angular);