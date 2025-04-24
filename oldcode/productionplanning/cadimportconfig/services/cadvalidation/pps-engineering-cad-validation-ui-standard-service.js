/**
 * Created by lav on 7/24/2020.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	/**
	 * @ngdoc service
	 * @name ppsEngineeringCadValidationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsEngineeringCadValidationUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'ppsCadImportConfigurationTranslationService',
		'platformSchemaService', 'ppsEngineeringCadValidationConfigLayout',
		'platformUIStandardExtentService', 'ppsEngineeringCadValidationConfigLayoutConfig'];

	function UIStandardService(platformUIStandardConfigService, translationService,
							   platformSchemaService, layout,
							   platformUIStandardExtentService, layoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'EngCadValidationDto',
			moduleSubModule: 'ProductionPlanning.CadImportConfig'
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