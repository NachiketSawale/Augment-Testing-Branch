(function () {

	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);


	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('productionplanningCommonProductFormworkDetailController', ProductionplanningCommonProductFormworkDetailController);

	ProductionplanningCommonProductFormworkDetailController.$inject = [
		'$scope',
		'platformDetailControllerService',
		'productionplanningCommonProductFormworkDataService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory'];
	function ProductionplanningCommonProductFormworkDetailController(
		$scope,
		detailControllerService,
		dataService,
		uiStandardService,
		validationServiceFactory) {
		var validationService = validationServiceFactory.getValidationService(dataService);
		detailControllerService.initDetailController($scope, dataService, validationService, uiStandardService,'productionplanningCommonTranslationService');
	}
})();