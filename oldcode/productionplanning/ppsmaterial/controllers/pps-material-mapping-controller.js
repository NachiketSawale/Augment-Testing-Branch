(function () {

	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);


	// many parameters because of dependency injection
	angModule.controller('productionplanningPpsmaterialMappingListController', PpsMaterialMappingController);

	PpsMaterialMappingController.$inject = ['$scope', 'platformContainerControllerService','platformTranslateService', 'productionplanningPpsMaterialMappingUIStandardService'];
	function PpsMaterialMappingController($scope, platformContainerControllerService,
		platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, $scope.getContentValue('moduleName') || moduleName, guid);
	}
})();