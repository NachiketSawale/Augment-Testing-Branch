(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);


	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('productionplanningPpsmaterialProductdescParameterListController', productionplanningPpsmaterialProductdescParameterListController);

	productionplanningPpsmaterialProductdescParameterListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningPpsMaterialProductDescParameterUIStandardService'];
	function productionplanningPpsmaterialProductdescParameterListController($scope, platformContainerControllerService,
																			 platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, $scope.getContentValue('moduleName') || moduleName, guid);
	}
})();