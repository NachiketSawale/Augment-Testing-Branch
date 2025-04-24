(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);
	/* jshint -W072*/ //many parameters because of dependency injection

	angModule.controller('productionplanningPpsmaterialProductdescDetailController', productionplanningPpsmaterialProductdescDetailController);

	productionplanningPpsmaterialProductdescDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningPpsMaterialProductDescUIStandardService'];
	function productionplanningPpsmaterialProductdescDetailController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		var module = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, module, guid, 'productionplanningPpsMaterialTranslationService');
	}

})();
