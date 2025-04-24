(function () {

	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);


	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('productionplanningCommonProductFormworkListController', ProductionplanningCommonProductFormworkListController);

	ProductionplanningCommonProductFormworkListController.$inject = ['$scope',
		'platformGridControllerService',
		'productionplanningCommonProductFormworkDataService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];
	function ProductionplanningCommonProductFormworkListController($scope,
		gridControllerService,
		dataService,
		uiStandardService,
		validationServiceFactory,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		var gridConfig = { initCalled: false, columns: [] };

		var validationService = validationServiceFactory.getValidationService(dataService);
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();
	}
})();