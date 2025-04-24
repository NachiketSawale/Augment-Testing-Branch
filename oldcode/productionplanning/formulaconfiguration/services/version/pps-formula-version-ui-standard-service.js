(function() {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaVersionLayout', Layout);

	Layout.$inject = ['$injector','ppsFormulaVersionStatusToId'];

	function Layout($injector,ppsFormulaVersionStatusToId) {

		return {
			fid: 'productionplanning.formulaconfiguration.formulaversion',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['formulaversion', 'status', 'islive', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				status:{
					readonly:true,
					'grid':{
						formatter: function (row, cell, value, columnDef, entity) {
							let status = ppsFormulaVersionStatusToId[value];
							return status ? '<img src="' + 'cloud.style/content/images/control-icons.svg#' + 'ico-' + status.description + '" alt="">': value;
						}
					}
				},
				formulaversion:{
					readonly:true
				}
			}
		};
	}

	angular.module(moduleName).factory('ppsFormulaVersionUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionPlanningFormulaConfigurationTranslationService',
		'ppsFormulaVersionLayout'];

	function UIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, layout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsFormulaVersionDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(layout, schemaProperties, translationService);

		return service;
	}
})();