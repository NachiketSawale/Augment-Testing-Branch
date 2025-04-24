/**
 * Created by xai on 4/11/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersion2CustomerController', basicsMaterialCatalogPriceVersion2CustomerController);

	basicsMaterialCatalogPriceVersion2CustomerController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialCatalogPriceVersionToCustomerUIStandardService',
		'basicsMaterialCatalogPriceVersion2CustomerService', 'basicsMaterialCatalogPriceVersion2CustomerValidationService'];

	function basicsMaterialCatalogPriceVersion2CustomerController($scope, platformGridControllerService, basicsMaterialCatalogPriceVersionToCustomerUIStandardService,
		basicsMaterialCatalogPriceVersion2CustomerService, basicsMaterialCatalogPriceVersion2CustomerValidationService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialCatalogPriceVersionToCustomerUIStandardService,
			basicsMaterialCatalogPriceVersion2CustomerService, basicsMaterialCatalogPriceVersion2CustomerValidationService(basicsMaterialCatalogPriceVersion2CustomerService), myGridConfig);
	}
})(angular);