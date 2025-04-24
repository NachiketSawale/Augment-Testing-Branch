/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersion2CompanyController', basicsMaterialCatalogPriceVersion2CompanyController);

	basicsMaterialCatalogPriceVersion2CompanyController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialCatalogPriceVersionToCompanyUIStandardService',
		'basicsMaterialCatalogPriceVersion2CompanyService', 'basicsMaterialCatalogPriceVersion2CompanyValidationService'];

	function basicsMaterialCatalogPriceVersion2CompanyController($scope, platformGridControllerService, basicsMaterialCatalogPriceVersionToCompanyUIStandardService,
		basicsMaterialCatalogPriceVersion2CompanyService, basicsMaterialCatalogPriceVersion2CompanyValidationService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialCatalogPriceVersionToCompanyUIStandardService,
			basicsMaterialCatalogPriceVersion2CompanyService, basicsMaterialCatalogPriceVersion2CompanyValidationService(basicsMaterialCatalogPriceVersion2CompanyService), myGridConfig);
	}
})(angular);