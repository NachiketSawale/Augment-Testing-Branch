(function(angular) {
	'use strict';
	/* global globals, angular */
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsFormulaListController', ListController);

	ListController.$inject = ['$scope', '$injector', 'platformContainerControllerService', 'platformTranslateService',
		'ppsFormulaUIStandardService'];

	function ListController($scope, $injector, platformContainerControllerService, platformTranslateService,
		uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		const containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid);
	}

})(angular);