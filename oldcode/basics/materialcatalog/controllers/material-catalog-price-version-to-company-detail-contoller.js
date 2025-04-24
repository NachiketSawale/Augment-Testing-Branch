/**
 * Created by chi on 5/31/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.materialcatalog';
	/* jshint -W072 */

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersionToCompanyDetailController', basicsMaterialCatalogPriceVersionToCompanyDetailController);
	basicsMaterialCatalogPriceVersionToCompanyDetailController.$inject = ['$scope', 'basicsMaterialCatalogPriceVersionToCompanyUIStandardService',
		'basicsMaterialCatalogPriceVersion2CompanyValidationService',
		'basicsMaterialCatalogPriceVersion2CompanyService',
		'platformDetailControllerService',
		'platformTranslateService'];
	function basicsMaterialCatalogPriceVersionToCompanyDetailController($scope, basicsMaterialCatalogPriceVersionToCompanyUIStandardService,
		basicsMaterialCatalogPriceVersion2CompanyValidationService,
		basicsMaterialCatalogPriceVersion2CompanyService,
		detailControllerService,
		translateService) {
		detailControllerService.initDetailController($scope, basicsMaterialCatalogPriceVersion2CompanyService,
			basicsMaterialCatalogPriceVersion2CompanyValidationService(basicsMaterialCatalogPriceVersion2CompanyService),
			basicsMaterialCatalogPriceVersionToCompanyUIStandardService, translateService);
	}
})(angular);