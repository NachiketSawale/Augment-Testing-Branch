/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersionController', basicsMaterialCatalogPriceVersionController);

	basicsMaterialCatalogPriceVersionController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialCatalogPriceVersionUIStandardService',
		'basicsMaterialCatalogPriceVersionValidationService', 'basicsMaterialCatalogPriceVersionService'];

	function basicsMaterialCatalogPriceVersionController($scope, platformGridControllerService, basicsMaterialCatalogPriceVersionUIStandardService,
		basicsMaterialCatalogPriceVersionValidationService, basicsMaterialCatalogPriceVersionService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialCatalogPriceVersionUIStandardService, basicsMaterialCatalogPriceVersionService, basicsMaterialCatalogPriceVersionValidationService(basicsMaterialCatalogPriceVersionService), myGridConfig);
	}
})(angular);