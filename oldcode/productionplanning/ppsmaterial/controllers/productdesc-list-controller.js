(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);


	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('productionplanningPpsmaterialProductdescListController', ProductdescListController);

	ProductdescListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningPpsMaterialProductDescUIStandardService'];
	function ProductdescListController($scope, platformContainerControllerService,
		platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, $scope.getContentValue('moduleName') || moduleName, guid);
	}
})();