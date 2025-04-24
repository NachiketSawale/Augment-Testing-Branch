/**
 * Created by chi on 5/25/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.materialcatalog';
	/* jshint -W072 */

	angular.module(moduleName).controller('basicsMaterialCatalogPriceVersionDetailController', basicsMaterialCatalogPriceVersionDetailController);
	basicsMaterialCatalogPriceVersionDetailController.$inject = ['$scope', 'basicsMaterialCatalogPriceVersionUIStandardService',
		'basicsMaterialCatalogPriceVersionValidationService',
		'basicsMaterialCatalogPriceVersionService',
		'platformDetailControllerService',
		'platformTranslateService'];
	function basicsMaterialCatalogPriceVersionDetailController($scope, basicsMaterialCatalogPriceVersionUIStandardService,
		basicsMaterialCatalogPriceVersionValidationService,
		basicsMaterialCatalogPriceVersionService,
		detailControllerService,
		translateService) {
		detailControllerService.initDetailController($scope, basicsMaterialCatalogPriceVersionService, basicsMaterialCatalogPriceVersionValidationService(basicsMaterialCatalogPriceVersionService),
			basicsMaterialCatalogPriceVersionUIStandardService, translateService);
	}
})(angular);