(function () {
	'use strict';
	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('ppsEngineeringItemClerkUIStandardService', ClerkUIStandardService);

	ClerkUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'ppsEngineeringItemClerkLayout'];

	function ClerkUIStandardService(platformUIStandardConfigService, ppsItemTranslationService,
	                                       platformSchemaService, clerkLayout) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'PPSItem2ClerkDto', moduleSubModule: 'ProductionPlanning.Item' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(clerkLayout, productdescParamAttributeDomains, ppsItemTranslationService);

		service.getProjectMainLayout = function () {
			return clerkLayout;
		};

		return service;
	}
})();
