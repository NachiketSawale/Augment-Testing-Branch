/**
 * Created by lav on 7/24/2020.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.cadimport';
	/**
	 * @ngdoc service
	 * @name ppsEngineeringCadImportLogUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsEngineeringCadImportLogUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'ppsCadImportTranslationService',
		'platformSchemaService', 'ppsEngineeringCadImportLogConfigLayout',
		'platformUIStandardExtentService', 'ppsEngineeringCadImportLogConfigLayoutConfig'];

	function UIStandardService(platformUIStandardConfigService, translationService,
							   platformSchemaService, layout,
							   platformUIStandardExtentService, layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ImportLogDto',
			moduleSubModule: 'ProductionPlanning.Drawing'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}

		var service = new BaseService(layout, schemaProperties, translationService);
		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		return service;
	}
})();