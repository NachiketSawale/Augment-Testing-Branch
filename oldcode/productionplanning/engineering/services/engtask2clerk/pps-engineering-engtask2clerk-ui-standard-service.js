(function () {
	'use strict';
	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('ppsEngTask2ClerkUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'ppsCommonLoggingUiService',
		'productionplanningEngineeringTranslationService',
		'ppsEngTask2ClerkLayout',
		'ppsEngTask2ClerkLayoutConfig'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
								ppsCommonLoggingUiService,
							   translationServ,
							   layout,
							   layoutConfig) {

		var BaseService = ppsCommonLoggingUiService;

		var schemaOption = {
			typeName: 'EngTask2ClerkDto',
			moduleSubModule: 'ProductionPlanning.Engineering'
		};
		var service = new BaseService(layout, schemaOption, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition);

		service.getProjectMainLayout = function () {
			return layout;
		};

		return service;
	}
})();
