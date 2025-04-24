(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemClerkListController', PPSItemClerkListController);

	PPSItemClerkListController.$inject = ['$scope', 'platformGridControllerService', 'productionplanningItemClerkDataService',
		'productionplanningItemClerkUIStandardService', 'productionplanningItemClerkValidationService'];

	function PPSItemClerkListController($scope, gridControllerService, dataService, uiStandardService, validationService) {
		var gridConfig = {};
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
	}

})(angular);