(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('productionplanningCommonHeaderClerkListController', ClerkListController);

	ClerkListController.$inject = ['$scope', '$injector', 'productionplanningCommonHeaderMainServiceFactory', 'platformGridControllerService', 'productionplanningCommonHeaderClerkDataServiceFactory',
		'productionplanningCommonHeaderClerkUIStandardService', 'productionplanningCommonHeaderClerkValidationService'];

	function ClerkListController($scope, $injector, headerMainServiceFactory, gridControllerService, clerkDataServiceFactory, uiStandardService, validationService) {
		var gridConfig = {};

		var foreignKey = $scope.getContentValue('foreignKey');
		var currentModuleName = $scope.getContentValue('currentModule');
		var parentServiceName = $scope.getContentValue('parentService');
		var parentService = $injector.get(parentServiceName);

		var headerMainService = headerMainServiceFactory.getService(foreignKey, currentModuleName, parentService);
		var clerkDataService = clerkDataServiceFactory.getService(headerMainService);

		gridControllerService.initListController($scope, uiStandardService, clerkDataService, validationService, gridConfig);
	}

})(angular);
