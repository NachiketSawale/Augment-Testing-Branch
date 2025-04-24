/**
 * Created by lav on 7/24/2020.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.cadimport';
	/**
	 * @ngdoc service
	 * @name ppsCadImportPreviewUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('ppsCadImportPreviewUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'ppsCadImportTranslationService',
		'platformSchemaService', 'ppsCadImportPreviewConfigLayout',
		'platformUIStandardExtentService'];

	function UIStandardService(platformUIStandardConfigService, translationService,
							   platformSchemaService, layout,
							   platformUIStandardExtentService) {

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'EngCadImportPreviewDto',
			moduleSubModule: 'ProductionPlanning.Drawing'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}

		var service = new BaseService(layout, schemaProperties, translationService);
		platformUIStandardExtentService.extend(service, layout.addition, schemaProperties);

		return service;
	}
})();