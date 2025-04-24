(function() {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaInstanceLayout', Layout);

	Layout.$inject = ['$injector'];

	function Layout($injector) {
		return {
			fid: 'productionplanning.formulaconfiguration.formulainstance',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['code', 'descriptioninfo', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {}
		};
	}

	angular.module(moduleName).factory('ppsFormulaInstanceUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionPlanningFormulaConfigurationTranslationService',
		'ppsFormulaInstanceLayout'];

	function UIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, layout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsFormulaInstanceDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(layout, schemaProperties, translationService);

		return service;
	}
})();