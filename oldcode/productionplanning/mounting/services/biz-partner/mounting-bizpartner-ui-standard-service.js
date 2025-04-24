(function () {
	'use strict';
	
	var moduleName = 'productionplanning.mounting';
	
	angular.module(moduleName).factory('productionplanningMountingReq2BizPartnerUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'productionplanningMountingReq2BizPartnerLayout', 'productionplanningMountingTranslationService'];
	
	function UIStandardService(platformUIStandardConfigService, platformSchemaService, layout, translationService) {
		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Requisition2BizPartnerDto',
			moduleSubModule: 'ProductionPlanning.Mounting'
		});

		var schemaProperties = dtoSchema.properties;

		function Req2BizPartnerUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		Req2BizPartnerUIStandardService.prototype = Object.create(BaseService.prototype);
		Req2BizPartnerUIStandardService.prototype.constructor = Req2BizPartnerUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationService);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
