/**
 * Created by zwz on 2019/12/18
 */
(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningConfigurationEventTypeQtySlotListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningConfigurationEventTypeQtySlotDataService',
		'productionplanningConfigurationEventTypeQtySlotUIStandardService',
		'productionplanningConfigurationEventTypeQtySlotValidationService'];

	function ListController($scope, platformGridControllerService,
							dataService,
							uiStandardService,
							validationService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'EventTypeSlotList'
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
	}
})(angular);