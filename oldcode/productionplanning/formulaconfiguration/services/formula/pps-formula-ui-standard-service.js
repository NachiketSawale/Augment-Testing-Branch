(function() {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaLayout', Layout);

	Layout.$inject = ['$injector'];

	function Layout($injector) {
		return {
			fid: 'productionplanning.formulaconfiguration.formula',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['description', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {}
		};
	}

	angular.module(moduleName).factory('ppsFormulaUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionPlanningFormulaConfigurationTranslationService',
		'ppsFormulaLayout'];

	function UIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, ppsFormulaLayout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsFormulaDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(ppsFormulaLayout, schemaProperties, translationService);

		return service;
	}
})();