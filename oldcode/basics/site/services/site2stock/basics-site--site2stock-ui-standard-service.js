(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2StockUIStandardService', Site2StockUIStandardService);

	Site2StockUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsSiteTranslationService',
		'platformSchemaService', 'basicsSite2StockLayout'];

	function Site2StockUIStandardService(platformUIStandardConfigService, basicsSiteTranslationService,
	                                platformSchemaService, site2StockLayout) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'Site2StockDto', moduleSubModule: 'Basics.Site' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(site2StockLayout, productdescParamAttributeDomains, basicsSiteTranslationService);

		service.getProjectMainLayout = function () {
			return site2StockLayout;
		};

		return service;
	}
})();
