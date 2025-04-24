(function () {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonCalendarSiteUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningCommonTranslationService',
		'ppsCommonCalendarSiteLayout',
		'ppsCommonCalendarSiteLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsCalendarForSiteDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});
		var schemaProperties = dtoSchema.properties;

		function CalendarSiteUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		CalendarSiteUIStandardService.prototype = Object.create(BaseService.prototype);
		CalendarSiteUIStandardService.prototype.constructor = CalendarSiteUIStandardService;

		var service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		return service;
	}
})();
