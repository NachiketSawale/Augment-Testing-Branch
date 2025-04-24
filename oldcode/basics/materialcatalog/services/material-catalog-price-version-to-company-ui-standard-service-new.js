/**
 * Created by chi on 6/2/2017.
 */
(function () {
	'use strict';

	var moduleName = 'basics.materialcatalog';
	/**
     * @ngdoc service
     * @name basicsMaterialCatalogPriceVersionToCompanyUIStandardServiceNew
     * @function
     *
     * @description
     * This service provides standard layouts for different containers
     */
	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersionToCompanyUIStandardServiceNew', basicsMaterialCatalogPriceVersionToCompanyUIStandardService);

	basicsMaterialCatalogPriceVersionToCompanyUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsMaterialCatalogPriceVersionToCompanyLayoutNew',
		'basicsMaterialcatalogTranslationService', 'platformSchemaService', 'platformUIStandardExtentService'];

	function basicsMaterialCatalogPriceVersionToCompanyUIStandardService(platformUIStandardConfigService, basicsMaterialCatalogPriceVersionToCompanyLayout,
		basicsMaterialcatalogTranslationService, platformSchemaService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'PriceVersionUsedCompanyDto',
			moduleSubModule: 'Basics.MaterialCatalog'
		}).properties;

		domains.Checked = {domain: 'boolean'};
		var service = new BaseService(basicsMaterialCatalogPriceVersionToCompanyLayout, domains, basicsMaterialcatalogTranslationService);

		platformUIStandardExtentService.extend(service, basicsMaterialCatalogPriceVersionToCompanyLayout.addition, domains);
		return service;
	}
})(angular);