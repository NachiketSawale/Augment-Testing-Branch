(function () {

	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);


	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('productionplanningCommonProductProductionSetListController', ProductionplanningCommonProductProductionSetListController);

	ProductionplanningCommonProductProductionSetListController.$inject = ['$scope',
		'platformGridControllerService',
		'productionplanningCommonProductProductionSetDataService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory',
		'basicsCommonReferenceControllerService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];
	function ProductionplanningCommonProductProductionSetListController($scope,
		gridControllerService,
		dataService,
		uiStandardService,
		validationServiceFactory,
		referenceControllerService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {
		var gridConfig = { initCalled: false, columns: [] };
		$scope.modalOptions = {
			headerText: 'PPS Product'
		};
		var validationService = validationServiceFactory.getValidationService(dataService);
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
		referenceControllerService.extendReferenceButtons($scope, dataService);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();
	}
})();