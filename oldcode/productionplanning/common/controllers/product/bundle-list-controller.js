(function () {
	'use strict';

	var module = 'productionplanning.common';

	angular.module(module).controller('productionplanningCommonProductBundleListController', ProductionplanningCommonProductBundleListController);

	ProductionplanningCommonProductBundleListController.$inject = [
		'$scope', 'platformGridControllerService', 'productionplanningCommonProductBundleDataService',
		'productionplanningCommonProductUIStandardService', 'productionplanningCommonProductValidationFactory',
		'basicsCommonReferenceControllerService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];

	function ProductionplanningCommonProductBundleListController($scope, gridControllerService,
		dataService, uiStandardService,
		validationServiceFactory,
		referenceControllerService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {
		var gridConfig = {initCalled: false, columns: []};

		var validationService = validationServiceFactory.getValidationService(dataService);
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
		referenceControllerService.extendReferenceButtons($scope, dataService);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();
	}
})();