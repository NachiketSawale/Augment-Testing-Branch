(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonHeaderClerkUIStandardService', ClerkUIStandardService);

	ClerkUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService',
		'platformSchemaService', 'productionplanningCommonHeaderClerkLayout'];

	function ClerkUIStandardService(platformUIStandardConfigService, ppsCommonTranslationService,
	                                       platformSchemaService, clerkLayout) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'Header2ClerkDto', moduleSubModule: 'ProductionPlanning.Header' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(clerkLayout, productdescParamAttributeDomains, ppsCommonTranslationService);

		service.getProjectMainLayout = function () {
			return clerkLayout;
		};

		return service;
	}
})();
