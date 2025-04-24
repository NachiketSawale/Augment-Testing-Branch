(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemSourceUIStandardService', PpsItemSourceUIStandardService);

	PpsItemSourceUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningItemTranslationService',
		'platformSchemaService', 'ppsItemSourceLayout'];

	function PpsItemSourceUIStandardService(platformUIStandardConfigService, ppsItemTranslationService,
										   platformSchemaService, ppsItemSourceLayout) {

		var BaseService = platformUIStandardConfigService;

		var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'PpsItemSourceDto', moduleSubModule: 'ProductionPlanning.Item' });
		productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(ppsItemSourceLayout, productdescParamAttributeDomains, ppsItemTranslationService);

		service.getProjectMainLayout = function () {
			return ppsItemSourceLayout;
		};

		return service;
	}
})();
