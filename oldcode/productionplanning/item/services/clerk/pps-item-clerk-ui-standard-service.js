(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemClerkUIStandardService', PPSItemClerkUIStandardService);

	PPSItemClerkUIStandardService.$inject = ['ppsCommonLoggingUiService', 'productionplanningItemTranslationService',
		                                     'platformSchemaService', 'productionplanningItemClerkLayout'];

	function PPSItemClerkUIStandardService(ppsCommonLoggingUiService, ppsItemTranslationService,
	                                              platformSchemaService, ppsItemClerkLayout) {

		var BaseService = ppsCommonLoggingUiService;

		function ProductdescParamUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
		ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

		var service =  new BaseService(ppsItemClerkLayout, { typeName: 'PPSItem2ClerkDto', moduleSubModule: 'ProductionPlanning.Item' }, ppsItemTranslationService);

		service.getProjectMainLayout = function () {
			return ppsItemClerkLayout;
		};

		return service;
	}
})();
