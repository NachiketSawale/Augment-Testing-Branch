(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2ExternalUIStandardService', Site2ExternalUIStandardService);

	Site2ExternalUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsSiteTranslationService',
		'platformSchemaService', 'basicsSite2ExternalLayout'];

	function Site2ExternalUIStandardService(platformUIStandardConfigService, basicsSiteTranslationService,
	                                     platformSchemaService, site2ExternalLayout) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'Site2ExternalDto', moduleSubModule: 'Basics.Site' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(site2ExternalLayout, productdescParamAttributeDomains, basicsSiteTranslationService);

		service.getProjectMainLayout = function () {
			return site2ExternalLayout;
		};

		return service;
	}
})();
