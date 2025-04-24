(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonBizPartnerUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningCommonTranslationService',
		'ppsCommonBizPartnerLayout',
		'ppsCommonBizPartnerLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'CommonBizPartnerDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});
		var schemaProperties = dtoSchema.properties;

		function Header2BpUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		Header2BpUIStandardService.prototype = Object.create(BaseService.prototype);
		Header2BpUIStandardService.prototype.constructor = Header2BpUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		return service;
	}
})();
