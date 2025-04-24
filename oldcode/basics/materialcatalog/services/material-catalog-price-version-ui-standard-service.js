/**
 * Created by chi on 5/25/2017.
 */
(function () {
	'use strict';

	var moduleName = 'basics.materialcatalog';
	/**
     * @ngdoc service
     * @name basicsMaterialCatalogPriceVersionUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers
     */
	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersionUIStandardService', basicsMaterialCatalogPriceVersionUIStandardService);

	basicsMaterialCatalogPriceVersionUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsMaterialCatalogPriceVersionLayout', 'basicsMaterialcatalogTranslationService', 'platformSchemaService'];

	function basicsMaterialCatalogPriceVersionUIStandardService(platformUIStandardConfigService, basicsMaterialCatalogPriceVersionLayout, basicsMaterialcatalogTranslationService, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MaterialPriceVersionDto', moduleSubModule: 'Basics.MaterialCatalog' }).properties;
		return new BaseService(basicsMaterialCatalogPriceVersionLayout, domains, basicsMaterialcatalogTranslationService);
	}
})(angular);