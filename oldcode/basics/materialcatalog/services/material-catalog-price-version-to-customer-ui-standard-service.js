/**
 * Created by xai on 4/11/2018.
 */

(function () {
	'use strict';

	var moduleName = 'basics.materialcatalog';
	/**
     * @ngdoc service
     * @name basicsMaterialCatalogPriceVersionToCompanyUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers
     */
	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersionToCustomerUIStandardService', basicsMaterialCatalogPriceVersionToCustomerUIStandardService);

	basicsMaterialCatalogPriceVersionToCustomerUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsMaterialCatalogPriceVersionToCustomerLayout',
		'basicsMaterialcatalogTranslationService', 'platformSchemaService', 'platformUIStandardExtentService'];

	function basicsMaterialCatalogPriceVersionToCustomerUIStandardService(platformUIStandardConfigService, basicsMaterialCatalogPriceVersionToCustomerLayout,
		basicsMaterialcatalogTranslationService, platformSchemaService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({ typeName: 'MdcMatPricever2custDto', moduleSubModule: 'Basics.MaterialCatalog' }).properties;
		var service = new BaseService(basicsMaterialCatalogPriceVersionToCustomerLayout, domains, basicsMaterialcatalogTranslationService);

		platformUIStandardExtentService.extend(service, basicsMaterialCatalogPriceVersionToCustomerLayout.addition, domains);
		return service;
	}
})(angular);