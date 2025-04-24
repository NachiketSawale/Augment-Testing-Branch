(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonBizPartnerContactUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningCommonTranslationService',
		'ppsCommonBizPartnerContactLayout',
		'ppsCommonBizPartnerContactLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'CommonBizPartnerContactDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});
		var schemaProperties = dtoSchema.properties;

		function CommonBizPartnerContactUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		CommonBizPartnerContactUIStandardService.prototype = Object.create(BaseService.prototype);
		CommonBizPartnerContactUIStandardService.prototype.constructor = CommonBizPartnerContactUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		return service;
	}
})();
