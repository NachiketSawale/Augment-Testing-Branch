(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemReassignedProductUIStandardService', ReassignedProductUIStandardService);

	ReassignedProductUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'productionplanningItemReassignedProductLayout', 'ppsCommonLayoutOverloadService'];

	function ReassignedProductUIStandardService(platformUIStandardConfigService, ppsItemTranslationService,
	                                       platformSchemaService, reassignedProductLayout, ppsCommonLayoutOverloadService) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ReassignedDto', moduleSubModule: 'ProductionPlanning.Item' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(reassignedProductLayout, productdescParamAttributeDomains, ppsItemTranslationService);

		service.getProjectMainLayout = function () {
			return reassignedProductLayout;
		};

		ppsCommonLayoutOverloadService.translateCustomUom(service);
		return service;
	}
})();
