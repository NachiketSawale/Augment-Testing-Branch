(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).controller('ppsEngineeringItemClerkListController', ClerkListController);

	ClerkListController.$inject = ['$scope', 'platformGridControllerService', 'ppsEngineeringItemClerkDataService',
		'ppsEngineeringItemClerkUIStandardService'];

	function ClerkListController($scope, gridControllerService, dataService, uiStandardService) {
		gridControllerService.initListController($scope, uiStandardService, dataService, {}, {});
	}

})(angular);