/**
 * Created by xai on 4/11/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.materialcatalog';
	/* jshint -W072 */

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersion2CustomerDetailController', basicsMaterialCatalogPriceVersion2CustomerDetailController);
	basicsMaterialCatalogPriceVersion2CustomerDetailController.$inject = ['$scope', 'basicsMaterialCatalogPriceVersionToCustomerUIStandardService',
		'basicsMaterialCatalogPriceVersion2CustomerValidationService',
		'basicsMaterialCatalogPriceVersion2CustomerService',
		'platformDetailControllerService',
		'platformTranslateService'];
	function basicsMaterialCatalogPriceVersion2CustomerDetailController($scope, basicsMaterialCatalogPriceVersionToCustomerUIStandardService,
		basicsMaterialCatalogPriceVersion2CustomerValidationService,
		basicsMaterialCatalogPriceVersion2CustomerService,
		detailControllerService,
		translateService) {
		detailControllerService.initDetailController($scope, basicsMaterialCatalogPriceVersion2CustomerService,
			basicsMaterialCatalogPriceVersion2CustomerValidationService(basicsMaterialCatalogPriceVersion2CustomerService),
			basicsMaterialCatalogPriceVersionToCustomerUIStandardService, translateService);
	}
})(angular);